const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seed = require('./seedData');

dotenv.config();

const User = require('../models/User');
const TechnicianProfile = require('../models/TechnicianProfile');
const ServiceCategory = require('../models/ServiceCategory');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const RegisteredAsset = require('../models/RegisteredAsset');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/servease_ai';
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB. Seeding collections...');
    await seed.seedAll(User, TechnicianProfile, ServiceCategory, Service, Booking, RegisteredAsset, Review, Notification);
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

run();
