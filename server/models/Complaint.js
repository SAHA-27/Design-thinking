const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintNumber: { type: String, required: true, unique: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: {
    type: String,
    enum: ['Quality of Work', 'Billing Dispute', 'Punctuality / Delay', 'Damage to Asset', 'Professional Behavior', 'Other'],
    default: 'Quality of Work'
  },
  description: { type: String, required: true },
  desiredResolution: { type: String, default: 'Free Revisit / Partial Refund' },
  status: {
    type: String,
    enum: ['Open', 'Under Investigation', 'Resolved', 'Closed'],
    default: 'Open'
  },
  adminNotes: { type: String, default: '' },
  refundAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

module.exports = mongoose.model('Complaint', complaintSchema);
