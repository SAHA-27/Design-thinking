const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  titleTa: { type: String, default: '' },
  message: { type: String, required: true },
  messageTa: { type: String, default: '' },
  type: {
    type: String,
    enum: ['booking_update', 'quote_received', 'maintenance_reminder', 'emergency_alert', 'payment_success', 'admin_announcement'],
    default: 'booking_update'
  },
  referenceId: { type: String, default: '' }, // e.g. bookingId or assetId
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
