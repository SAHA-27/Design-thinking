const mongoose = require('mongoose');

const serviceLogSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  serviceDate: { type: Date, default: Date.now },
  serviceType: { type: String, required: true },
  technicianName: { type: String, default: '' },
  replacedParts: [{ type: String }],
  totalCost: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  invoiceNumber: { type: String, default: '' }
});

const registeredAssetSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // e.g. "Living Room Daikin Split AC" or "Honda Activa 6G"
  category: { type: String, required: true }, // e.g. "AC", "RO Water Purifier", "Bike", "Washing Machine", "Car"
  brand: { type: String, required: true }, // e.g. "Daikin", "Kent", "Honda", "LG"
  model: { type: String, default: '' },
  purchaseDate: { type: String, default: '' }, // YYYY-MM-DD
  serialOrPlateNumber: { type: String, default: '' },
  warrantyExpiryDate: { type: String, default: '' },
  lastServiceDate: { type: String, default: '' },
  nextMaintenanceDate: { type: String, default: '' },
  maintenanceIntervalMonths: { type: Number, default: 6 },
  healthStatus: { type: String, enum: ['Good', 'Service Due', 'Urgent Attention'], default: 'Good' },
  totalSpentOnMaintenance: { type: Number, default: 0 },
  serviceHistory: [serviceLogSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RegisteredAsset', registeredAssetSchema);
