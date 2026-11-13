const loyaltyService = require('../services/loyaltyService');
const { getStore } = require('../services/dataStore');

/**
 * Customer: Get current Rewards Wallet and Next Tier Milestone Progress
 */
exports.getMyWallet = async (req, res) => {
  try {
    const customerId = req.user.id;
    const config = await loyaltyService.getProgramConfig();
    const wallet = await loyaltyService.getOrCreateWallet(customerId);

    // Calculate progression toward next milestone
    const completedCount = wallet.completedBookingsCount || 0;
    const tiers = config.tiers || {};

    let targetTier = null;
    let targetBookings = 0;
    let targetReward = 0;
    let prevMilestoneBookings = 0;

    if (completedCount < (tiers.bronze?.minBookings || 5)) {
      targetTier = tiers.bronze?.name || 'Bronze Member';
      targetBookings = tiers.bronze?.minBookings || 5;
      targetReward = tiers.bronze?.rewardAmount || 100;
      prevMilestoneBookings = 0;
    } else if (completedCount < (tiers.silver?.minBookings || 10)) {
      targetTier = tiers.silver?.name || 'Silver Member';
      targetBookings = tiers.silver?.minBookings || 10;
      targetReward = tiers.silver?.rewardAmount || 250;
      prevMilestoneBookings = tiers.bronze?.minBookings || 5;
    } else if (completedCount < (tiers.gold?.minBookings || 20)) {
      targetTier = tiers.gold?.name || 'Gold Member';
      targetBookings = tiers.gold?.minBookings || 20;
      targetReward = tiers.gold?.rewardAmount || 500;
      prevMilestoneBookings = tiers.silver?.minBookings || 10;
    } else if (completedCount < (tiers.platinum?.minBookings || 30)) {
      targetTier = tiers.platinum?.name || 'Platinum Member';
      targetBookings = tiers.platinum?.minBookings || 30;
      targetReward = tiers.platinum?.rewardAmount || 1000;
      prevMilestoneBookings = tiers.gold?.minBookings || 20;
    } else {
      // Reached top tier
      targetTier = 'Top Tier Achieved (Platinum Elite)';
      targetBookings = tiers.platinum?.minBookings || 30;
      targetReward = tiers.platinum?.rewardAmount || 1000;
      prevMilestoneBookings = tiers.gold?.minBookings || 20;
    }

    const remainingBookings = Math.max(0, targetBookings - completedCount);
    const rangeSpan = Math.max(1, targetBookings - prevMilestoneBookings);
    const progressSpan = Math.max(0, completedCount - prevMilestoneBookings);
    const progressPercent = completedCount >= targetBookings
      ? 100
      : Math.min(100, Math.round((progressSpan / rangeSpan) * 100));

    const progression = {
      completedCount,
      targetTier,
      targetBookings,
      targetReward,
      remainingBookings,
      progressPercent,
      isTopTier: completedCount >= (tiers.platinum?.minBookings || 30),
      nextMilestoneName: targetTier,
      bookingsRemaining: remainingBookings,
      nextRewardAmount: targetReward
    };

    const walletData = wallet.toObject ? wallet.toObject() : { ...wallet };
    walletData.progression = progression;

    res.json({
      success: true,
      wallet: walletData,
      progression,
      config
    });
  } catch (error) {
    console.error('getMyWallet error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rewards wallet.' });
  }
};

/**
 * Customer: Get Rewards Transaction History
 */
exports.getMyTransactions = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { isDb, RewardTransaction, mem } = getStore();

    if (isDb) {
      const transactions = await RewardTransaction.find({ customerId })
        .sort({ createdAt: -1 })
        .limit(100);
      return res.json({ success: true, transactions });
    } else {
      const transactions = mem.rewardTransactions
        .filter(t => t.customerId.toString() === customerId.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, transactions });
    }
  } catch (error) {
    console.error('getMyTransactions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rewards history.' });
  }
};

/**
 * Customer: Acknowledge celebratory reward popup
 */
exports.acknowledgeRewardPopup = async (req, res) => {
  try {
    const customerId = req.user.id;
    await loyaltyService.acknowledgeCelebration(customerId);
    res.json({ success: true, message: 'Reward acknowledged.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to acknowledge reward.' });
  }
};

/**
 * Admin: Get Loyalty Program Analytics & Summary
 */
exports.getAdminSummary = async (req, res) => {
  try {
    const { isDb, LoyaltyWallet, RewardTransaction, mem } = getStore();
    const config = await loyaltyService.getProgramConfig();

    if (isDb) {
      const wallets = await LoyaltyWallet.find().lean();
      const transactions = await RewardTransaction.find().lean();

      let totalEarned = 0;
      let totalRedeemed = 0;
      let availableLiability = 0;
      const tierCounts = {
        'Member': 0,
        'Bronze Member': 0,
        'Silver Member': 0,
        'Gold Member': 0,
        'Platinum Member': 0
      };

      wallets.forEach(w => {
        totalEarned += w.totalRewardsEarned || 0;
        totalRedeemed += w.totalRewardsRedeemed || 0;
        availableLiability += w.availableBalance || 0;
        if (tierCounts[w.currentTier] !== undefined) {
          tierCounts[w.currentTier]++;
        } else {
          tierCounts['Member']++;
        }
      });

      const summaryData = {
        totalMembers: wallets.length,
        totalWallets: wallets.length,
        totalEarned,
        totalRewardsEarned: totalEarned,
        totalRedeemed,
        totalRewardsRedeemed: totalRedeemed,
        availableLiability,
        availableWalletLiability: availableLiability,
        tierCounts,
        totalTransactionsCount: transactions.length,
        isEnabled: config.isEnabled,
        program: config
      };

      return res.json({
        success: true,
        summary: summaryData,
        config
      });
    } else {
      const wallets = mem.loyaltyWallets;
      let totalEarned = 0;
      let totalRedeemed = 0;
      let availableLiability = 0;
      const tierCounts = {
        'Member': 0,
        'Bronze Member': 0,
        'Silver Member': 0,
        'Gold Member': 0,
        'Platinum Member': 0
      };

      wallets.forEach(w => {
        totalEarned += w.totalRewardsEarned || 0;
        totalRedeemed += w.totalRewardsRedeemed || 0;
        availableLiability += w.availableBalance || 0;
        if (tierCounts[w.currentTier] !== undefined) {
          tierCounts[w.currentTier]++;
        } else {
          tierCounts['Member']++;
        }
      });

      const memSummaryData = {
        totalMembers: wallets.length,
        totalWallets: wallets.length,
        totalEarned,
        totalRewardsEarned: totalEarned,
        totalRedeemed,
        totalRewardsRedeemed: totalRedeemed,
        availableLiability,
        availableWalletLiability: availableLiability,
        tierCounts,
        totalTransactionsCount: mem.rewardTransactions.length,
        isEnabled: config.isEnabled,
        program: config
      };

      return res.json({
        success: true,
        summary: memSummaryData,
        config
      });
    }
  } catch (error) {
    console.error('getAdminSummary error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin loyalty summary.' });
  }
};

/**
 * Admin: Get List of Customers with Loyalty Wallets
 */
exports.getAdminCustomers = async (req, res) => {
  try {
    const { isDb, LoyaltyWallet, User, mem } = getStore();
    const search = (req.query.search || '').trim().toLowerCase();

    if (isDb) {
      let query = {};
      if (search) {
        const matchingUsers = await User.find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
          ]
        }).select('_id');
        const userIds = matchingUsers.map(u => u._id);
        query.customerId = { $in: userIds };
      }

      const wallets = await LoyaltyWallet.find(query)
        .populate('customerId', 'name email phone avatar')
        .sort({ completedBookingsCount: -1 });

      return res.json({ success: true, customers: wallets });
    } else {
      let wallets = mem.loyaltyWallets.map(w => {
        const user = mem.users.find(u => u._id.toString() === w.customerId.toString());
        return {
          ...w,
          customerId: user ? { _id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar } : { name: 'Customer' }
        };
      });

      if (search) {
        wallets = wallets.filter(w => {
          const name = (w.customerId?.name || '').toLowerCase();
          const email = (w.customerId?.email || '').toLowerCase();
          const phone = (w.customerId?.phone || '').toLowerCase();
          return name.includes(search) || email.includes(search) || phone.includes(search);
        });
      }

      return res.json({ success: true, customers: wallets });
    }
  } catch (error) {
    console.error('getAdminCustomers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch loyalty customers.' });
  }
};

/**
 * Admin: Get Audit Ledger of Reward Transactions
 */
exports.getAdminTransactions = async (req, res) => {
  try {
    const { isDb, RewardTransaction, mem } = getStore();
    const { category, type } = req.query;

    if (isDb) {
      const filter = {};
      if (category && category !== 'all') filter.category = category;
      if (type && type !== 'all') filter.type = type;

      const transactions = await RewardTransaction.find(filter)
        .populate('customerId', 'name email phone')
        .populate('adminUserId', 'name email')
        .sort({ createdAt: -1 })
        .limit(200);

      return res.json({ success: true, transactions });
    } else {
      let transactions = mem.rewardTransactions.map(t => {
        const cust = mem.users.find(u => u._id.toString() === t.customerId.toString());
        const admin = t.adminUserId ? mem.users.find(u => u._id.toString() === t.adminUserId.toString()) : null;
        return {
          ...t,
          customerId: cust ? { _id: cust._id, name: cust.name, email: cust.email, phone: cust.phone } : { name: 'Customer' },
          adminUserId: admin ? { _id: admin._id, name: admin.name, email: admin.email } : null
        };
      });

      if (category && category !== 'all') {
        transactions = transactions.filter(t => t.category === category);
      }
      if (type && type !== 'all') {
        transactions = transactions.filter(t => t.type === type);
      }

      return res.json({ success: true, transactions });
    }
  } catch (error) {
    console.error('getAdminTransactions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reward transactions.' });
  }
};

/**
 * Admin: Update Loyalty Program Configuration (Milestones, Bonus amounts, Enabled)
 */
exports.updateProgramConfig = async (req, res) => {
  try {
    const { isEnabled, maxRedemptionPercent } = req.body;
    let tiers = req.body.tiers || req.body.milestones;
    if (tiers) {
      // Normalize minBookings vs requiredCompletedBookings
      ['bronze', 'silver', 'gold', 'platinum'].forEach(key => {
        if (tiers[key]) {
          if (tiers[key].requiredCompletedBookings !== undefined && tiers[key].minBookings === undefined) {
            tiers[key].minBookings = tiers[key].requiredCompletedBookings;
          }
        }
      });
    }
    const { isDb, LoyaltyProgram, mem } = getStore();

    if (isDb) {
      let config = await LoyaltyProgram.findOne();
      if (!config) {
        config = new LoyaltyProgram();
      }

      if (typeof isEnabled === 'boolean') config.isEnabled = isEnabled;
      if (tiers) {
        if (tiers.bronze) config.tiers.bronze = { ...config.tiers.bronze, ...tiers.bronze };
        if (tiers.silver) config.tiers.silver = { ...config.tiers.silver, ...tiers.silver };
        if (tiers.gold) config.tiers.gold = { ...config.tiers.gold, ...tiers.gold };
        if (tiers.platinum) config.tiers.platinum = { ...config.tiers.platinum, ...tiers.platinum };
      }
      if (maxRedemptionPercent !== undefined) config.maxRedemptionPercent = Number(maxRedemptionPercent);
      config.updatedAt = new Date();
      config.updatedBy = req.user.id;

      await config.save();
      return res.json({ success: true, message: 'Loyalty program configuration updated successfully!', config });
    } else {
      if (typeof isEnabled === 'boolean') mem.loyaltyProgram.isEnabled = isEnabled;
      if (tiers) {
        if (tiers.bronze) mem.loyaltyProgram.tiers.bronze = { ...mem.loyaltyProgram.tiers.bronze, ...tiers.bronze };
        if (tiers.silver) mem.loyaltyProgram.tiers.silver = { ...mem.loyaltyProgram.tiers.silver, ...tiers.silver };
        if (tiers.gold) mem.loyaltyProgram.tiers.gold = { ...mem.loyaltyProgram.tiers.gold, ...tiers.gold };
        if (tiers.platinum) mem.loyaltyProgram.tiers.platinum = { ...mem.loyaltyProgram.tiers.platinum, ...tiers.platinum };
      }
      if (maxRedemptionPercent !== undefined) mem.loyaltyProgram.maxRedemptionPercent = Number(maxRedemptionPercent);
      mem.loyaltyProgram.updatedAt = new Date();

      return res.json({ success: true, message: 'Loyalty program configuration updated successfully!', config: mem.loyaltyProgram });
    }
  } catch (error) {
    console.error('updateProgramConfig error:', error);
    res.status(500).json({ success: false, message: 'Failed to update program configuration.' });
  }
};

/**
 * Admin: Manual Balance Adjustment (Audited)
 */
exports.adjustCustomerBalance = async (req, res) => {
  try {
    const { customerId, amount, type, reason } = req.body;
    const adminUserId = req.user.id;

    if (!customerId || !amount || !type || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customerId, amount, type (credit/debit), and an audit reason.'
      });
    }

    const result = await loyaltyService.adminAdjustBalance({
      customerId,
      amount,
      type,
      reason,
      adminUserId
    });

    res.json({
      success: true,
      message: `Successfully adjusted customer balance by ${type === 'debit' ? '-' : '+'}₹${amount}.`,
      result,
      wallet: result.wallet
    });
  } catch (error) {
    console.error('adjustCustomerBalance error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to adjust customer balance.' });
  }
};
