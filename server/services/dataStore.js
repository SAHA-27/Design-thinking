const bcrypt = require('bcryptjs');
const seed = require('../seed/seedData');
const { isDbConnected } = require('../config/db');

// Models
const User = require('../models/User');
const TechnicianProfile = require('../models/TechnicianProfile');
const ServiceCategory = require('../models/ServiceCategory');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const RegisteredAsset = require('../models/RegisteredAsset');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Complaint = require('../models/Complaint');
const LoyaltyProgram = require('../models/LoyaltyProgram');
const LoyaltyWallet = require('../models/LoyaltyWallet');
const RewardTransaction = require('../models/RewardTransaction');
const OtpToken = require('../models/OtpToken');

// In-Memory store for resilient instant execution if MongoDB is disconnected
class MemoryStore {
  constructor() {
    this.users = JSON.parse(JSON.stringify(seed.usersData));
    this.technicianProfiles = JSON.parse(JSON.stringify(seed.technicianProfilesData));
    this.categories = JSON.parse(JSON.stringify(seed.categoriesData));
    this.services = JSON.parse(JSON.stringify(seed.servicesData));
    this.registeredAssets = JSON.parse(JSON.stringify(seed.registeredAssetsData));
    this.bookings = JSON.parse(JSON.stringify(seed.bookingsData));
    this.reviews = JSON.parse(JSON.stringify(seed.reviewsData));
    this.notifications = JSON.parse(JSON.stringify(seed.notificationsData));
    this.otpTokens = [];
    this.complaints = [
      {
        _id: '667000000000000000000001',
        complaintNumber: 'CMP-2026-081',
        bookingId: '663000000000000000000001',
        customerId: '660000000000000000000001',
        technicianId: '660000000000000000000002',
        category: 'Billing Dispute',
        description: 'Need clarification on pipe material warranty and replacement cost difference.',
        desiredResolution: 'Warranty certificate and discount voucher',
        status: 'Under Investigation',
        adminNotes: 'Assigned to Senior Ops Manager for verification.',
        refundAmount: 0,
        createdAt: new Date('2026-10-10T14:00:00Z')
      }
    ];
    this.promoCodes = [
      { code: 'SERVE50', discount: 50, type: 'flat', minOrder: 300, validUntil: '2026-12-31' },
      { code: 'SMARTAI', discount: 15, type: 'percent', maxDiscount: 200, minOrder: 500, validUntil: '2026-12-31' },
      { code: 'WELCOME100', discount: 100, type: 'flat', minOrder: 499, validUntil: '2026-12-31' }
    ];

    // Loyalty Program In-Memory State
    this.loyaltyProgram = {
      _id: 'mem_loyalty_config_01',
      programName: 'Smart Service Customer Rewards',
      isEnabled: true,
      tiers: {
        bronze: {
          minBookings: 5,
          rewardAmount: 100,
          name: 'Bronze Member',
          perks: ['₹100 Instant Bonus Credit', 'Priority Customer Support']
        },
        silver: {
          minBookings: 10,
          rewardAmount: 250,
          name: 'Silver Member',
          perks: ['₹250 Instant Bonus Credit', '5% Off Spare Parts', 'Free Annual Equipment Inspection']
        },
        gold: {
          minBookings: 20,
          rewardAmount: 500,
          name: 'Gold Member',
          perks: ['₹500 Instant Bonus Credit', '10% Off Spare Parts', 'Zero Visiting Charges on Emergency Bookings']
        },
        platinum: {
          minBookings: 30,
          rewardAmount: 1000,
          name: 'Platinum Member',
          perks: ['₹1,000 Instant Bonus Credit', 'Dedicated VIP Technician Dispatch', 'Free RO Filter Renewal Kit']
        }
      },
      maxRedemptionPercent: 100,
      rewardExpiryDays: 0,
      termsAndConditions: 'Rewards are awarded only on successfully completed and verified service bookings. Cancelled or disputed bookings do not count. Rewards are non-transferable.',
      updatedAt: new Date()
    };

    // Pre-seed demo customer wallet with realistic history
    this.loyaltyWallets = [
      {
        _id: 'mem_wallet_001',
        customerId: '660000000000000000000001', // Demo Customer (Karthik Raman)
        currentTier: 'Bronze Member',
        completedBookingsCount: 6,
        availableBalance: 100,
        totalRewardsEarned: 100,
        totalRewardsRedeemed: 0,
        unlockedMilestones: [
          {
            milestoneKey: 'bronze',
            tierName: 'Bronze Member',
            rewardAmount: 100,
            completedBookingsAtUnlock: 5,
            unlockedAt: new Date(Date.now() - 7 * 86400000)
          }
        ],
        unacknowledgedReward: null,
        createdAt: new Date(Date.now() - 30 * 86400000),
        updatedAt: new Date()
      }
    ];

    this.rewardTransactions = [
      {
        _id: 'mem_tx_001',
        customerId: '660000000000000000000001',
        walletId: 'mem_wallet_001',
        type: 'credit',
        category: 'milestone_reward',
        amount: 100,
        balanceAfter: 100,
        milestoneKey: 'bronze',
        title: 'Bronze Member Bonus',
        description: 'Unlocked for reaching 5 successfully completed service bookings.',
        status: 'Available',
        createdAt: new Date(Date.now() - 7 * 86400000)
      }
    ];

    // Hash default password
    const hash = bcrypt.hashSync('password123', 8);
    this.users.forEach(u => {
      u.password = hash;
    });
  }
}

const memoryStore = new MemoryStore();

module.exports = {
  memoryStore,
  getStore: () => {
    return {
      isDb: isDbConnected(),
      User,
      TechnicianProfile,
      ServiceCategory,
      Service,
      Booking,
      RegisteredAsset,
      Review,
      Notification,
      Complaint,
      LoyaltyProgram,
      LoyaltyWallet,
      RewardTransaction,
      OtpToken,
      mem: memoryStore
    };
  }
};
