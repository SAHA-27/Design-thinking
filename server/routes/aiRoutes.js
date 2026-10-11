const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/diagnose', aiController.diagnoseProblem);

module.exports = router;
