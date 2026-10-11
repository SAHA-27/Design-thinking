const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/search', technicianController.searchTechnicians);
router.get('/:id', technicianController.getTechnicianById);
router.put('/status', authenticate, authorize('technician'), technicianController.updateTechnicianStatus);

module.exports = router;
