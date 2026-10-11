const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getStore } = require('../services/dataStore');

// Submit review
router.post('/', authenticate, async (req, res) => {
  try {
    const customerId = req.user.id;
    const { bookingId, technicianId, serviceId, rating, comment, aspects } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and comment.' });
    }

    const { isDb, Review, Booking, mem } = getStore();

    const reviewData = {
      bookingId,
      customerId,
      technicianId: technicianId || (isDb ? null : '660000000000000000000002'),
      serviceId,
      rating: Number(rating),
      comment,
      aspects: aspects || { punctuality: 5, workQuality: 5, cleanliness: 5, pricingTransparency: 5 },
      photos: [],
      createdAt: new Date()
    };

    if (isDb) {
      const review = await Review.create(reviewData);
      return res.status(201).json({ success: true, message: 'Review submitted! Thank you.', review });
    } else {
      reviewData._id = 'mem_review_' + Date.now();
      mem.reviews.unshift(reviewData);
      return res.status(201).json({ success: true, message: 'Review submitted! Thank you.', review: reviewData });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
});

// File complaint / dispute
router.post('/complaint', authenticate, async (req, res) => {
  try {
    const customerId = req.user.id;
    const { bookingId, technicianId, category, description, desiredResolution } = req.body;

    if (!bookingId || !description) {
      return res.status(400).json({ success: false, message: 'Please provide booking ID and description.' });
    }

    const complaintNumber = 'CMP-2026-' + Math.floor(100 + Math.random() * 900);
    const complaintData = {
      complaintNumber,
      bookingId,
      customerId,
      technicianId,
      category: category || 'Quality of Work',
      description,
      desiredResolution: desiredResolution || 'Free Revisit / Partial Refund',
      status: 'Open',
      adminNotes: '',
      refundAmount: 0,
      createdAt: new Date()
    };

    const { isDb, Complaint, mem } = getStore();

    if (isDb) {
      const complaint = await Complaint.create(complaintData);
      return res.status(201).json({ success: true, message: 'Complaint registered. Ticket: ' + complaintNumber, complaint });
    } else {
      complaintData._id = 'mem_cmp_' + Date.now();
      mem.complaints.unshift(complaintData);
      return res.status(201).json({ success: true, message: 'Complaint registered. Ticket: ' + complaintNumber, complaint: complaintData });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit complaint.' });
  }
});

module.exports = router;
