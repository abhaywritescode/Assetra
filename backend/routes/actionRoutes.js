const express = require('express');
const actionController = require('../controllers/actionController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, actionController.getActions);
router.patch('/:id/dismiss', requireAuth, actionController.dismissAction);

module.exports = router;
