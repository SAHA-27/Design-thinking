const mongoose = require('mongoose');

const rewardTransactionSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  walletId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LoyaltyWallet',
    required: true 
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  category: {
    type: String,
    enum: ['milestone_reward', 'booking_redemption', 'admin_adjustment', 'booking_refund', 'reward_expired'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  balanceAfter: {
    type: Number,
    required: true,
    min: 0
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  bookingNumber: {
    type: String,
    default: ''
  },
  milestoneKey: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'none'],
    default: 'none'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Available', 'Redeemed', 'Expired', 'Pending', 'Cancelled'],
    default: 'Available'
  },
  expiresAt: {
    type: Date
  },
  adminUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('RewardTransaction', rewardTransactionSchema);
