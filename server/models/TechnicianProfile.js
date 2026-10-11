const mongoose = require('mongoose');

const technicianProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  skills: [{ type: String }], // e.g. ['RO Water Purifier', 'AC Repair', 'Plumbing']
  serviceAreas: [{ type: String }], // e.g. ['Anna Nagar', 'T. Nagar', 'Velachery', 'Adyar', 'Tambaram']
  experienceYears: { type: Number, default: 3 },
  visitingFee: { type: Number, default: 199 },
  hourlyRate: { type: Number, default: 299 },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 24 },
  verified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  kycDocumentUrl: { type: String, default: '' },
  idType: { type: String, default: 'Aadhaar / National ID' },
  isAvailable: { type: Boolean, default: true },
  emergencyAvailable: { type: Boolean, default: true },
  completedJobsCount: { type: Number, default: 58 },
  totalEarnings: { type: Number, default: 48500 },
  trustScore: { type: Number, default: 92 }, // 0 to 100
  trustFactors: {
    idVerified: { type: Boolean, default: true },
    completionRate: { type: Number, default: 98 }, // 98%
    punctualityRate: { type: Number, default: 95 }, // 95%
    rehireRate: { type: Number, default: 88 },
    zeroComplaintBadge: { type: Boolean, default: true }
  },
  currentLocation: {
    lat: { type: Number, default: 13.0827 },
    lng: { type: Number, default: 80.2707 },
    addressText: { type: String, default: 'Chennai Central Zone' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TechnicianProfile', technicianProfileSchema);
