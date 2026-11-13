const mongoose = require('mongoose');

const unlockedMilestoneSchema = new mongoose.Schema({
  milestoneKey: { type: String, required: true }, // 'bronze' | 'silver' | 'gold' | 'platinum'
  tierName: { type: String, required: true },
  rewardAmount: { type: Number, required: true },
  completedBookingsAtUnlock: { type: Number, required: true },
  unlockedAt: { type: Date, default: Date.now },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
}, { _id: false });

const loyaltyWalletSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true, 
    index: true 
  },
  currentTier: {
    type: String,
    enum: ['Member', 'Bronze Member', 'Silver Member', 'Gold Member', 'Platinum Member'],
    default: 'Member'
  },
  completedBookingsCount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  availableBalance: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  totalRewardsEarned: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  totalRewardsRedeemed: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  unlockedMilestones: [unlockedMilestoneSchema],
  unacknowledgedReward: {
    milestoneKey: { type: String },
    tierName: { type: String },
    rewardAmount: { type: Number },
    unlockedAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

loyaltyWalletSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('LoyaltyWallet', loyaltyWalletSchema);
