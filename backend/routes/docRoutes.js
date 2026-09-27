const express = require('express');
const docController = require('../controllers/docController');
const { requireAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', upload.single('file'), docController.uploadDocument);
router.get('/:id/view', requireAuth, docController.viewDocument);
router.put('/:id', requireAuth, docController.updateDocument);
router.delete('/:id', requireAuth, docController.deleteDocument);

module.exports = router;
