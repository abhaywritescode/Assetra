const express = require('express');
const impactController = require('../controllers/impactController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', requireAuth, impactController.getImpactSummary);

module.exports = router;
