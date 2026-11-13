const { getStore } = require('./dataStore');

/**
 * Helper to retrieve or initialize the LoyaltyProgram configuration
 */
async function getProgramConfig() {
  const { isDb, LoyaltyProgram, mem } = getStore();

  if (isDb) {
    let config = await LoyaltyProgram.findOne();
    if (!config) {
      config = await LoyaltyProgram.create({
        programName: 'Smart Service Customer Rewards',
        isEnabled: true,
        tiers: {
          bronze: { minBookings: 5, rewardAmount: 100, name: 'Bronze Member', perks: ['₹100 Instant Bonus Credit', 'Priority Customer Support'] },
          silver: { minBookings: 10, rewardAmount: 250, name: 'Silver Member', perks: ['₹250 Instant Bonus Credit', '5% Off Spare Parts', 'Free Annual Equipment Inspection'] },
          gold: { minBookings: 20, rewardAmount: 500, name: 'Gold Member', perks: ['₹500 Instant Bonus Credit', '10% Off Spare Parts', 'Zero Visiting Charges on Emergency Bookings'] },
          platinum: { minBookings: 30, rewardAmount: 1000, name: 'Platinum Member', perks: ['₹1,000 Instant Bonus Credit', 'Dedicated VIP Technician Dispatch', 'Free RO Filter Renewal Kit'] }
        },
        maxRedemptionPercent: 100,
        rewardExpiryDays: 0
      });
    }
    return config;
  } else {
    if (!mem.loyaltyProgram) {
      mem.loyaltyProgram = {
        _id: 'mem_loyalty_config_01',
        programName: 'Smart Service Customer Rewards',
        isEnabled: true,
        tiers: {
          bronze: { minBookings: 5, rewardAmount: 100, name: 'Bronze Member', perks: ['₹100 Instant Bonus Credit', 'Priority Customer Support'] },
          silver: { minBookings: 10, rewardAmount: 250, name: 'Silver Member', perks: ['₹250 Instant Bonus Credit', '5% Off Spare Parts', 'Free Annual Equipment Inspection'] },
          gold: { minBookings: 20, rewardAmount: 500, name: 'Gold Member', perks: ['₹500 Instant Bonus Credit', '10% Off Spare Parts', 'Zero Visiting Charges on Emergency Bookings'] },
          platinum: { minBookings: 30, rewardAmount: 1000, name: 'Platinum Member', perks: ['₹1,000 Instant Bonus Credit', 'Dedicated VIP Technician Dispatch', 'Free RO Filter Renewal Kit'] }
        },
        maxRedemptionPercent: 100,
        rewardExpiryDays: 0,
        updatedAt: new Date()
      };
    }
    return mem.loyaltyProgram;
  }
}

/**
 * Determine the tier name corresponding to completed bookings count
 */
function resolveTier(completedCount, config) {
  const tiers = config.tiers || {};
  if (tiers.platinum && completedCount >= tiers.platinum.minBookings) return tiers.platinum.name || 'Platinum Member';
  if (tiers.gold && completedCount >= tiers.gold.minBookings) return tiers.gold.name || 'Gold Member';
  if (tiers.silver && completedCount >= tiers.silver.minBookings) return tiers.silver.name || 'Silver Member';
  if (tiers.bronze && completedCount >= tiers.bronze.minBookings) return tiers.bronze.name || 'Bronze Member';
  return 'Member';
}

/**
 * Get or create the Customer's Loyalty Wallet
 */
async function getOrCreateWallet(customerId) {
  const { isDb, LoyaltyWallet, Booking, mem } = getStore();
  const config = await getProgramConfig();

  if (isDb) {
    let wallet = await LoyaltyWallet.findOne({ customerId });
    if (!wallet) {
      // Count verified completed bookings historically
      const completedCount = await Booking.countDocuments({
        customerId,
        status: 'Completed'
      });
      const tier = resolveTier(completedCount, config);

      wallet = await LoyaltyWallet.create({
        customerId,
        currentTier: tier,
        completedBookingsCount: completedCount,
        availableBalance: 0,
        totalRewardsEarned: 0,
        totalRewardsRedeemed: 0,
        unlockedMilestones: []
      });
    }
    return wallet;
  } else {
    let wallet = mem.loyaltyWallets.find(w => w.customerId.toString() === customerId.toString());
    if (!wallet) {
      const completedCount = mem.bookings.filter(b => b.customerId.toString() === customerId.toString() && b.status === 'Completed').length;
      const tier = resolveTier(completedCount, config);
      wallet = {
        _id: 'mem_wallet_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        customerId: customerId.toString(),
        currentTier: tier,
        completedBookingsCount: completedCount,
        availableBalance: 0,
        totalRewardsEarned: 0,
        totalRewardsRedeemed: 0,
        unlockedMilestones: [],
        unacknowledgedReward: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mem.loyaltyWallets.push(wallet);
    }
    return wallet;
  }
}

/**
 * Process loyalty milestone progression upon verified booking completion.
 * IDEMPOTENT: Prevents duplicate reward awards via `booking.loyaltyProcessed` flag.
 */
async function processBookingCompletionLoyalty(bookingId) {
  try {
    const { isDb, Booking, LoyaltyWallet, RewardTransaction, Notification, mem } = getStore();
    const config = await getProgramConfig();

    if (!config.isEnabled) {
      console.log('ℹ️ Loyalty program is currently disabled by administrator. Skipping rewards.');
      return null;
    }

    if (isDb) {
      const booking = await Booking.findById(bookingId);
      if (!booking) return null;

      // Idempotency check: booking must be Completed and not already processed
      if (booking.loyaltyProcessed) {
        console.log(`ℹ️ Booking #${booking.bookingNumber} loyalty rewards already processed.`);
        return null;
      }
      if (booking.status !== 'Completed') {
        console.log(`ℹ️ Booking #${booking.bookingNumber} is not Completed (Status: ${booking.status}).`);
        return null;
      }

      const customerId = booking.customerId;
      const wallet = await getOrCreateWallet(customerId);

      // Count only verified completed bookings
      const completedCount = await Booking.countDocuments({
        customerId,
        status: 'Completed'
      });

      wallet.completedBookingsCount = completedCount;
      wallet.currentTier = resolveTier(completedCount, config);

      // Check milestones in ascending order: bronze, silver, gold, platinum
      const milestoneKeys = ['bronze', 'silver', 'gold', 'platinum'];
      const newlyUnlocked = [];

      for (const key of milestoneKeys) {
        const tierConfig = config.tiers[key];
        if (!tierConfig) continue;

        // Check if customer qualifies
        if (completedCount >= tierConfig.minBookings) {
          const alreadyUnlocked = wallet.unlockedMilestones.some(m => m.milestoneKey === key);
          if (!alreadyUnlocked) {
            // Award this milestone reward!
            const rewardAmount = tierConfig.rewardAmount;
            wallet.availableBalance += rewardAmount;
            wallet.totalRewardsEarned += rewardAmount;

            const milestoneRecord = {
              milestoneKey: key,
              tierName: tierConfig.name,
              rewardAmount,
              completedBookingsAtUnlock: completedCount,
              unlockedAt: new Date(),
              bookingId: booking._id
            };
            wallet.unlockedMilestones.push(milestoneRecord);

            // Record transaction in immutable audit ledger
            await RewardTransaction.create({
              customerId,
              walletId: wallet._id,
              type: 'credit',
              category: 'milestone_reward',
              amount: rewardAmount,
              balanceAfter: wallet.availableBalance,
              bookingId: booking._id,
              bookingNumber: booking.bookingNumber,
              milestoneKey: key,
              title: `${tierConfig.name} Milestone Bonus`,
              description: `Awarded ₹${rewardAmount} for reaching ${tierConfig.minBookings} completed service bookings!`,
              status: 'Available'
            });

            // In-app Notification
            await Notification.create({
              recipientId: customerId,
              title: `🎉 ${tierConfig.name} Unlocked! Bonus: ₹${rewardAmount}`,
              titleTa: `🎉 ${tierConfig.name} நிலை எட்டப்பட்டது! வெகுமதி: ₹${rewardAmount}`,
              message: `Congratulations! You completed ${completedCount} services and unlocked ${tierConfig.name}. ₹${rewardAmount} has been credited to your Rewards Wallet!`,
              messageTa: `வாழ்த்துக்கள்! நீங்கள் ${completedCount} சேவைகளை முடித்து ${tierConfig.name} நிலையை அடைந்துள்ளீர்கள். ₹${rewardAmount} உங்கள் வாலட்டில் வரவு வைக்கப்பட்டது!`,
              type: 'reward_earned',
              referenceId: booking._id.toString()
            });

            wallet.unacknowledgedReward = {
              milestoneKey: key,
              tierName: tierConfig.name,
              rewardAmount,
              unlockedAt: new Date()
            };

            newlyUnlocked.push(milestoneRecord);
          }
        }
      }

      await wallet.save();

      // Mark booking as processed to guarantee strict idempotency
      booking.loyaltyProcessed = true;
      await booking.save();

      return { wallet, newlyUnlocked };
    } else {
      // In-Memory store implementation
      const booking = mem.bookings.find(b => b._id.toString() === bookingId.toString() || b.bookingNumber === bookingId);
      if (!booking || booking.loyaltyProcessed || booking.status !== 'Completed') {
        return null;
      }

      const customerId = booking.customerId.toString();
      const wallet = await getOrCreateWallet(customerId);

      const completedCount = mem.bookings.filter(b => b.customerId.toString() === customerId && b.status === 'Completed').length;
      wallet.completedBookingsCount = completedCount;
      wallet.currentTier = resolveTier(completedCount, config);

      const milestoneKeys = ['bronze', 'silver', 'gold', 'platinum'];
      const newlyUnlocked = [];

      for (const key of milestoneKeys) {
        const tierConfig = config.tiers[key];
        if (!tierConfig) continue;

        if (completedCount >= tierConfig.minBookings) {
          const alreadyUnlocked = wallet.unlockedMilestones.some(m => m.milestoneKey === key);
          if (!alreadyUnlocked) {
            const rewardAmount = tierConfig.rewardAmount;
            wallet.availableBalance += rewardAmount;
            wallet.totalRewardsEarned += rewardAmount;

            const milestoneRecord = {
              milestoneKey: key,
              tierName: tierConfig.name,
              rewardAmount,
              completedBookingsAtUnlock: completedCount,
              unlockedAt: new Date(),
              bookingId: booking._id
            };
            wallet.unlockedMilestones.push(milestoneRecord);

            const tx = {
              _id: 'mem_tx_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
              customerId,
              walletId: wallet._id,
              type: 'credit',
              category: 'milestone_reward',
              amount: rewardAmount,
              balanceAfter: wallet.availableBalance,
              bookingId: booking._id,
              bookingNumber: booking.bookingNumber,
              milestoneKey: key,
              title: `${tierConfig.name} Milestone Bonus`,
              description: `Awarded ₹${rewardAmount} for reaching ${tierConfig.minBookings} completed service bookings!`,
              status: 'Available',
              createdAt: new Date()
            };
            mem.rewardTransactions.unshift(tx);

            mem.notifications.unshift({
              _id: 'mem_notif_' + Date.now(),
              recipientId: customerId,
              title: `🎉 ${tierConfig.name} Unlocked! Bonus: ₹${rewardAmount}`,
              titleTa: `🎉 ${tierConfig.name} நிலை எட்டப்பட்டது! வெகுமதி: ₹${rewardAmount}`,
              message: `Congratulations! You completed ${completedCount} services and unlocked ${tierConfig.name}. ₹${rewardAmount} has been credited to your Rewards Wallet!`,
              messageTa: `வாழ்த்துக்கள்! நீங்கள் ${completedCount} சேவைகளை முடித்து ${tierConfig.name} நிலையை அடைந்துள்ளீர்கள். ₹${rewardAmount} உங்கள் வாலட்டில் வரவு வைக்கப்பட்டது!`,
              type: 'reward_earned',
              referenceId: booking._id.toString(),
              isRead: false,
              createdAt: new Date()
            });

            wallet.unacknowledgedReward = {
              milestoneKey: key,
              tierName: tierConfig.name,
              rewardAmount,
              unlockedAt: new Date()
            };

            newlyUnlocked.push(milestoneRecord);
          }
        }
      }

      booking.loyaltyProcessed = true;
      return { wallet, newlyUnlocked };
    }
  } catch (err) {
    console.error('processBookingCompletionLoyalty error:', err);
    return null;
  }
}

/**
 * Redeem rewards from customer wallet against a booking
 */
async function redeemRewardsForBooking({ customerId, amount, bookingNumber, bookingId }) {
  const redeemAmount = Number(amount);
  if (!redeemAmount || redeemAmount <= 0) return { success: false, message: 'Invalid reward amount.' };

  const { isDb, LoyaltyWallet, RewardTransaction, Notification, mem } = getStore();

  if (isDb) {
    const wallet = await getOrCreateWallet(customerId);
    if (wallet.availableBalance < redeemAmount) {
      return {
        success: false,
        message: `Insufficient rewards balance. Available: ₹${wallet.availableBalance}, requested: ₹${redeemAmount}`
      };
    }

    wallet.availableBalance -= redeemAmount;
    wallet.totalRewardsRedeemed += redeemAmount;
    await wallet.save();

    await RewardTransaction.create({
      customerId,
      walletId: wallet._id,
      type: 'debit',
      category: 'booking_redemption',
      amount: redeemAmount,
      balanceAfter: wallet.availableBalance,
      bookingId: bookingId || undefined,
      bookingNumber: bookingNumber || '',
      title: `Redeemed on Booking #${bookingNumber}`,
      description: `Applied ₹${redeemAmount} reward discount toward service checkout.`,
      status: 'Redeemed'
    });

    await Notification.create({
      recipientId: customerId,
      title: `Rewards Redeemed: ₹${redeemAmount}`,
      titleTa: `வெகுமதி பயன்படுத்தப்பட்டது: ₹${redeemAmount}`,
      message: `₹${redeemAmount} from your Rewards Wallet was applied to booking #${bookingNumber}. New balance: ₹${wallet.availableBalance}.`,
      messageTa: `உங்கள் முன்பதிவு #${bookingNumber}-க்கு ₹${redeemAmount} கழிவு செய்யப்பட்டது. புதிய இருப்பு: ₹${wallet.availableBalance}.`,
      type: 'reward_redeemed',
      referenceId: bookingId ? bookingId.toString() : ''
    });

    return { success: true, redeemedAmount: redeemAmount, newBalance: wallet.availableBalance };
  } else {
    const wallet = await getOrCreateWallet(customerId);
    if (wallet.availableBalance < redeemAmount) {
      return {
        success: false,
        message: `Insufficient rewards balance. Available: ₹${wallet.availableBalance}, requested: ₹${redeemAmount}`
      };
    }

    wallet.availableBalance -= redeemAmount;
    wallet.totalRewardsRedeemed += redeemAmount;

    mem.rewardTransactions.unshift({
      _id: 'mem_tx_' + Date.now(),
      customerId,
      walletId: wallet._id,
      type: 'debit',
      category: 'booking_redemption',
      amount: redeemAmount,
      balanceAfter: wallet.availableBalance,
      bookingId: bookingId || undefined,
      bookingNumber: bookingNumber || '',
      title: `Redeemed on Booking #${bookingNumber}`,
      description: `Applied ₹${redeemAmount} reward discount toward service checkout.`,
      status: 'Redeemed',
      createdAt: new Date()
    });

    mem.notifications.unshift({
      _id: 'mem_notif_' + Date.now(),
      recipientId: customerId,
      title: `Rewards Redeemed: ₹${redeemAmount}`,
      titleTa: `வெகுமதி பயன்படுத்தப்பட்டது: ₹${redeemAmount}`,
      message: `₹${redeemAmount} from your Rewards Wallet was applied to booking #${bookingNumber}. New balance: ₹${wallet.availableBalance}.`,
      messageTa: `உங்கள் முன்பதிவு #${bookingNumber}-க்கு ₹${redeemAmount} கழிவு செய்யப்பட்டது. புதிய இருப்பு: ₹${wallet.availableBalance}.`,
      type: 'reward_redeemed',
      referenceId: bookingId ? bookingId.toString() : '',
      isRead: false,
      createdAt: new Date()
    });

    return { success: true, redeemedAmount: redeemAmount, newBalance: wallet.availableBalance };
  }
}

/**
 * Refund redeemed rewards if booking is cancelled before service initiation
 */
async function refundRewardsForBooking({ customerId, amount, bookingNumber, bookingId }) {
  const refundAmount = Number(amount);
  if (!refundAmount || refundAmount <= 0) return { success: false };

  const { isDb, LoyaltyWallet, RewardTransaction, Notification, mem } = getStore();

  if (isDb) {
    const wallet = await getOrCreateWallet(customerId);
    wallet.availableBalance += refundAmount;
    wallet.totalRewardsRedeemed = Math.max(0, wallet.totalRewardsRedeemed - refundAmount);
    await wallet.save();

    await RewardTransaction.create({
      customerId,
      walletId: wallet._id,
      type: 'credit',
      category: 'booking_refund',
      amount: refundAmount,
      balanceAfter: wallet.availableBalance,
      bookingId: bookingId || undefined,
      bookingNumber: bookingNumber || '',
      title: `Reward Refund: Booking #${bookingNumber}`,
      description: `Re-credited ₹${refundAmount} following booking cancellation.`,
      status: 'Available'
    });

    await Notification.create({
      recipientId: customerId,
      title: `Rewards Re-credited: ₹${refundAmount}`,
      titleTa: `வெகுமதி திரும்ப வரவு: ₹${refundAmount}`,
      message: `₹${refundAmount} from cancelled booking #${bookingNumber} was refunded to your Rewards Wallet.`,
      type: 'reward_earned',
      referenceId: bookingId ? bookingId.toString() : ''
    });

    return { success: true, newBalance: wallet.availableBalance };
  } else {
    const wallet = await getOrCreateWallet(customerId);
    wallet.availableBalance += refundAmount;
    wallet.totalRewardsRedeemed = Math.max(0, wallet.totalRewardsRedeemed - refundAmount);

    mem.rewardTransactions.unshift({
      _id: 'mem_tx_' + Date.now(),
      customerId,
      walletId: wallet._id,
      type: 'credit',
      category: 'booking_refund',
      amount: refundAmount,
      balanceAfter: wallet.availableBalance,
      bookingId: bookingId || undefined,
      bookingNumber: bookingNumber || '',
      title: `Reward Refund: Booking #${bookingNumber}`,
      description: `Re-credited ₹${refundAmount} following booking cancellation.`,
      status: 'Available',
      createdAt: new Date()
    });

    return { success: true, newBalance: wallet.availableBalance };
  }
}

/**
 * Admin manual balance adjustment with audited reason note
 */
async function adminAdjustBalance({ customerId, amount, type, reason, adminUserId }) {
  const adjAmount = Math.abs(Number(amount));
  if (!adjAmount || adjAmount <= 0) throw new Error('Invalid adjustment amount.');
  if (!reason || reason.trim().length < 5) throw new Error('A descriptive audit reason is required (min 5 chars).');

  const { isDb, LoyaltyWallet, RewardTransaction, Notification, mem } = getStore();

  if (isDb) {
    const wallet = await getOrCreateWallet(customerId);

    if (type === 'debit') {
      if (wallet.availableBalance < adjAmount) {
        throw new Error(`Cannot debit ₹${adjAmount}; customer available balance is only ₹${wallet.availableBalance}`);
      }
      wallet.availableBalance -= adjAmount;
    } else {
      wallet.availableBalance += adjAmount;
      wallet.totalRewardsEarned += adjAmount;
    }

    await wallet.save();

    const tx = await RewardTransaction.create({
      customerId,
      walletId: wallet._id,
      type: type === 'debit' ? 'debit' : 'credit',
      category: 'admin_adjustment',
      amount: adjAmount,
      balanceAfter: wallet.availableBalance,
      title: `Admin Manual Adjustment (${type.toUpperCase()})`,
      description: reason,
      status: type === 'debit' ? 'Redeemed' : 'Available',
      adminUserId,
      adminNotes: reason
    });

    await Notification.create({
      recipientId: customerId,
      title: `Wallet Adjusted: ${type === 'debit' ? '-' : '+'}₹${adjAmount}`,
      message: `An administrator adjusted your Rewards Wallet: "${reason}". New balance: ₹${wallet.availableBalance}.`,
      type: 'booking_update'
    });

    return { success: true, transaction: tx, newBalance: wallet.availableBalance, wallet };
  } else {
    const wallet = await getOrCreateWallet(customerId);
    if (type === 'debit') {
      if (wallet.availableBalance < adjAmount) {
        throw new Error(`Cannot debit ₹${adjAmount}; customer available balance is only ₹${wallet.availableBalance}`);
      }
      wallet.availableBalance -= adjAmount;
    } else {
      wallet.availableBalance += adjAmount;
      wallet.totalRewardsEarned += adjAmount;
    }

    const tx = {
      _id: 'mem_tx_' + Date.now(),
      customerId,
      walletId: wallet._id,
      type: type === 'debit' ? 'debit' : 'credit',
      category: 'admin_adjustment',
      amount: adjAmount,
      balanceAfter: wallet.availableBalance,
      title: `Admin Manual Adjustment (${type.toUpperCase()})`,
      description: reason,
      status: type === 'debit' ? 'Redeemed' : 'Available',
      adminUserId,
      adminNotes: reason,
      createdAt: new Date()
    };
    mem.rewardTransactions.unshift(tx);

    return { success: true, transaction: tx, newBalance: wallet.availableBalance, wallet };
  }
}

/**
 * Acknowledge congratulatory popup
 */
async function acknowledgeCelebration(customerId) {
  const { isDb, LoyaltyWallet, mem } = getStore();

  if (isDb) {
    const wallet = await LoyaltyWallet.findOne({ customerId });
    if (wallet) {
      wallet.unacknowledgedReward = null;
      await wallet.save();
    }
  } else {
    const wallet = mem.loyaltyWallets.find(w => w.customerId.toString() === customerId.toString());
    if (wallet) {
      wallet.unacknowledgedReward = null;
    }
  }
  return { success: true };
}

module.exports = {
  getProgramConfig,
  resolveTier,
  getOrCreateWallet,
  processBookingCompletionLoyalty,
  redeemRewardsForBooking,
  refundRewardsForBooking,
  adminAdjustBalance,
  acknowledgeCelebration
};
