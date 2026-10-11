const express = require('express');
const router = express.Router();
const passportController = require('../controllers/passportController');
const { authenticate } = require('../middleware/auth');

router.get('/assets', authenticate, passportController.getRegisteredAssets);
router.post('/assets', authenticate, passportController.registerAsset);
router.get('/insights', authenticate, passportController.getCostInsights);
router.get('/subscriptions', passportController.getSubscriptions);

module.exports = router;
