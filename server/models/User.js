const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  title: { type: String, default: 'Home' },
  street: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, default: '' },
  pincode: { type: String, default: '' },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: {
    type: String,
    enum: ['customer', 'technician', 'admin'],
    default: 'customer'
  },
  avatar: { type: String, default: '' },
  language: { type: String, enum: ['en', 'ta'], default: 'en' },
  savedAddresses: [addressSchema],
  favouriteTechnicians: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
