const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameTa: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, required: true }, // Lucide icon name, e.g. Droplets, Wind, Bike, Car, Tv, Flame, Zap, Wrench, Sparkles, Paintbrush, Laptop, Hammer
  description: { type: String, required: true },
  descriptionTa: { type: String, required: true },
  bannerImage: { type: String, default: '' },
  serviceCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
});

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
