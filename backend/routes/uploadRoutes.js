const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const docController = require('../controllers/docController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, upload.array('receipts'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        
        // Mocking req.file for docController which expects a single file
        req.file = req.files[0];
        return docController.uploadDocument(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
