const mongoose = require('mongoose');

const loyaltyTierSchema = new mongoose.Schema({
  minBookings: { type: Number, required: true },
  rewardAmount: { type: Number, required: true },
  name: { type: String, required: true },
  perks: [{ type: String }]
}, { _id: false });

const loyaltyProgramSchema = new mongoose.Schema({
  programName: { type: String, default: 'Smart Service Customer Rewards' },
  isEnabled: { type: Boolean, default: true },
  tiers: {
    bronze: {
      type: loyaltyTierSchema,
      default: () => ({
        minBookings: 5,
        rewardAmount: 100,
        name: 'Bronze Member',
        perks: ['₹100 Instant Bonus Credit', 'Priority Customer Support']
      })
    },
    silver: {
      type: loyaltyTierSchema,
      default: () => ({
        minBookings: 10,
        rewardAmount: 250,
        name: 'Silver Member',
        perks: ['₹250 Instant Bonus Credit', '5% Off Spare Parts', 'Free Annual Equipment Inspection']
      })
    },
    gold: {
      type: loyaltyTierSchema,
      default: () => ({
        minBookings: 20,
        rewardAmount: 500,
        name: 'Gold Member',
        perks: ['₹500 Instant Bonus Credit', '10% Off Spare Parts', 'Zero Visiting Charges on Emergency Bookings']
      })
    },
    platinum: {
      type: loyaltyTierSchema,
      default: () => ({
        minBookings: 30,
        rewardAmount: 1000,
        name: 'Platinum Member',
        perks: ['₹1,000 Instant Bonus Credit', 'Dedicated VIP Technician Dispatch', 'Free RO Filter Renewal Kit']
      })
    }
  },
  maxRedemptionPercent: { type: Number, default: 100 }, // Max % of order total that can be discounted by rewards
  rewardExpiryDays: { type: Number, default: 0 }, // 0 = no expiry
  termsAndConditions: {
    type: String,
    default: 'Rewards are awarded only on successfully completed and verified service bookings. Cancelled or disputed bookings do not count. Rewards are non-transferable.'
  },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('LoyaltyProgram', loyaltyProgramSchema);
