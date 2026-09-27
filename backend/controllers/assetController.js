const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch all assets belonging to the authenticated user
exports.getUserAssets = async (req, res) => {
    try {
        const assets = await prisma.asset.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                document: true // Include document details if we want to show a link to the original receipt
            },
            orderBy: {
                purchaseDate: 'desc'
            }
        });
        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch a single asset belonging to the authenticated user
exports.getAssetDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await prisma.asset.findUnique({
            where: {
                id: id
            },
            include: {
                document: true
            }
        });

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Strict Data Isolation: Check if the asset belongs to the current user
        if (asset.userId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this asset' });
        }

        res.status(200).json(asset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a single asset
exports.deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await prisma.asset.findUnique({
            where: { id: id }
        });

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        if (asset.userId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this asset' });
        }

        await prisma.asset.delete({
            where: { id: id }
        });

        res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const asset = await prisma.asset.findUnique({ where: { id } });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        if (asset.userId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this asset' });
        }

        const updated = await prisma.asset.update({
            where: { id },
            data: {
                name: updates.name !== undefined ? updates.name : asset.name,
                brand: updates.brand !== undefined ? updates.brand : asset.brand,
                category: updates.category !== undefined ? updates.category : asset.category,
                purchasePrice: updates.purchasePrice !== undefined ? Number(updates.purchasePrice) : asset.purchasePrice,
                serialNumber: updates.serialNumber !== undefined ? updates.serialNumber : asset.serialNumber,
                warrantyExpiry: updates.warrantyExpiry ? new Date(updates.warrantyExpiry) : asset.warrantyExpiry,
                returnWindowExpiry: updates.returnWindowExpiry ? new Date(updates.returnWindowExpiry) : asset.returnWindowExpiry,
                subscriptionRenewal: updates.subscriptionRenewal ? new Date(updates.subscriptionRenewal) : asset.subscriptionRenewal,
            }
        });

        res.status(200).json({ message: 'Asset updated successfully', asset: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
