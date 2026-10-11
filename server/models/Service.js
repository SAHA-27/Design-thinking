const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
  title: { type: String, required: true },
  titleTa: { type: String, required: true },
  description: { type: String, required: true },
  descriptionTa: { type: String, required: true },
  basePrice: { type: Number, required: true },
  visitingCharge: { type: Number, default: 149 },
  sparePartsEstimateMin: { type: Number, default: 0 },
  sparePartsEstimateMax: { type: Number, default: 500 },
  estimatedDurationMins: { type: Number, default: 60 },
  warrantyDays: { type: Number, default: 30 },
  includedFeatures: [{ type: String }],
  includedFeaturesTa: [{ type: String }],
  excludedFeatures: [{ type: String }],
  recommendedIntervalMonths: { type: Number, default: 6 },
  rating: { type: Number, default: 4.8 },
  bookingCount: { type: Number, default: 120 },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
