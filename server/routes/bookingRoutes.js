const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, bookingController.createBooking);
router.get('/my-bookings', authenticate, bookingController.getCustomerBookings);
router.get('/technician-jobs', authenticate, authorize('technician'), bookingController.getTechnicianBookings);
router.get('/:id', authenticate, bookingController.getBookingById);
router.put('/:id/status', authenticate, bookingController.updateBookingStatus);
router.post('/:id/quote', authenticate, authorize('technician'), bookingController.submitRevisedQuote);
router.put('/:id/quote-response', authenticate, bookingController.respondToQuote);
router.post('/:id/proof', authenticate, authorize('technician'), bookingController.submitServiceProof);
router.put('/:id/approve-proof', authenticate, bookingController.approveServiceProof);
router.put('/:id/telemetry', authenticate, bookingController.updateTelemetry);
router.put('/:id/cancel', authenticate, bookingController.cancelBooking);

module.exports = router;
