const express = require('express');
const assetController = require('../controllers/assetController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all asset routes
router.use(requireAuth);

router.get('/', assetController.getUserAssets);
router.get('/:id', assetController.getAssetDetails);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
