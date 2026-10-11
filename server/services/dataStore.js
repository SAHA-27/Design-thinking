const bcrypt = require('bcryptjs');
const seed = require('../seed/seedData');
const { isDbConnected } = require('../config/db');

// Models
const User = require('../models/User');
const TechnicianProfile = require('../models/TechnicianProfile');
const ServiceCategory = require('../models/ServiceCategory');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const RegisteredAsset = require('../models/RegisteredAsset');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Complaint = require('../models/Complaint');

// In-Memory store for resilient instant execution if MongoDB is disconnected
class MemoryStore {
  constructor() {
    this.users = JSON.parse(JSON.stringify(seed.usersData));
    this.technicianProfiles = JSON.parse(JSON.stringify(seed.technicianProfilesData));
    this.categories = JSON.parse(JSON.stringify(seed.categoriesData));
    this.services = JSON.parse(JSON.stringify(seed.servicesData));
    this.registeredAssets = JSON.parse(JSON.stringify(seed.registeredAssetsData));
    this.bookings = JSON.parse(JSON.stringify(seed.bookingsData));
    this.reviews = JSON.parse(JSON.stringify(seed.reviewsData));
    this.notifications = JSON.parse(JSON.stringify(seed.notificationsData));
    this.complaints = [
      {
        _id: '667000000000000000000001',
        complaintNumber: 'CMP-2026-081',
        bookingId: '663000000000000000000001',
        customerId: '660000000000000000000001',
        technicianId: '660000000000000000000002',
        category: 'Billing Dispute',
        description: 'Need clarification on pipe material warranty and replacement cost difference.',
        desiredResolution: 'Warranty certificate and discount voucher',
        status: 'Under Investigation',
        adminNotes: 'Assigned to Senior Ops Manager for verification.',
        refundAmount: 0,
        createdAt: new Date('2026-10-10T14:00:00Z')
      }
    ];
    this.promoCodes = [
      { code: 'SERVE50', discount: 50, type: 'flat', minOrder: 300, validUntil: '2026-12-31' },
      { code: 'SMARTAI', discount: 15, type: 'percent', maxDiscount: 200, minOrder: 500, validUntil: '2026-12-31' },
      { code: 'WELCOME100', discount: 100, type: 'flat', minOrder: 499, validUntil: '2026-12-31' }
    ];

    // Hash default password
    const hash = bcrypt.hashSync('password123', 8);
    this.users.forEach(u => {
      u.password = hash;
    });
  }
}

const memoryStore = new MemoryStore();

module.exports = {
  memoryStore,
  getStore: () => {
    return {
      isDb: isDbConnected(),
      User,
      TechnicianProfile,
      ServiceCategory,
      Service,
      Booking,
      RegisteredAsset,
      Review,
      Notification,
      Complaint,
      mem: memoryStore
    };
  }
};
