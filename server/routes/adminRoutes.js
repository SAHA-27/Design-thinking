const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/stats', authenticate, authorize('admin'), adminController.getDashboardStats);
router.get('/technicians', authenticate, authorize('admin'), adminController.getTechniciansList);
router.put('/technicians/:id/verify', authenticate, authorize('admin'), adminController.verifyTechnician);
router.get('/complaints', authenticate, authorize('admin'), adminController.getComplaints);
router.put('/complaints/:id/resolve', authenticate, authorize('admin'), adminController.resolveComplaint);

module.exports = router;
