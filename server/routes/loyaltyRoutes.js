const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');
const { authenticate, authorize } = require('../middleware/auth');

// Customer Endpoints
router.get('/wallet', authenticate, loyaltyController.getMyWallet);
router.get('/transactions', authenticate, loyaltyController.getMyTransactions);
router.post('/celebrate/acknowledge', authenticate, loyaltyController.acknowledgeRewardPopup);

// Admin Management Endpoints
router.get('/admin/summary', authenticate, authorize('admin'), loyaltyController.getAdminSummary);
router.get('/admin/customers', authenticate, authorize('admin'), loyaltyController.getAdminCustomers);
router.get('/admin/transactions', authenticate, authorize('admin'), loyaltyController.getAdminTransactions);
router.put('/admin/config', authenticate, authorize('admin'), loyaltyController.updateProgramConfig);
router.post('/admin/adjust-balance', authenticate, authorize('admin'), loyaltyController.adjustCustomerBalance);

module.exports = router;
