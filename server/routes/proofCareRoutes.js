const express = require('express');
const router = express.Router();
const proofCareController = require('../controllers/proofCareController');
const { authenticate, authorize } = require('../middleware/auth');

// Technician on-site actions
router.post('/:id/check-in', authenticate, proofCareController.checkIn);
router.post('/:id/before-photos', authenticate, proofCareController.uploadBeforePhotos);
router.get('/:id/checklist', authenticate, proofCareController.getChecklist);
router.put('/:id/checklist', authenticate, proofCareController.updateChecklist);
router.post('/:id/work-and-parts', authenticate, proofCareController.recordWorkAndParts);
router.post('/:id/after-photos', authenticate, proofCareController.uploadAfterPhotos);
router.post('/:id/generate-otp', authenticate, proofCareController.generateCompletionOtp);

// Customer / Shared actions
router.post('/:id/verify-otp', authenticate, proofCareController.verifyCompletionOtp);
router.get('/:id/report', authenticate, proofCareController.getEvidenceReport);
router.post('/:id/dispute', authenticate, proofCareController.raiseDispute);

// Admin audit queue
router.get('/admin/audit-queue', authenticate, authorize('admin'), proofCareController.getAdminAuditQueue);

module.exports = router;
