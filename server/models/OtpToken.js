const mongoose = require('mongoose');

const otpTokenSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  otpHash: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 5
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  purpose: {
    type: String,
    enum: ['login', 'register', 'verification', 'phone_update'],
    default: 'login'
  },
  lastRequestedAt: {
    type: Date,
    default: Date.now
  },
  resendCount: {
    type: Number,
    default: 1
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // MongoDB TTL index to auto-remove expired documents
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OtpToken', otpTokenSchema);
