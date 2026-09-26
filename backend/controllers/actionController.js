const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { evaluateUserActions } = require('../services/actionEngine');

exports.getActions = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Ensure actions are up to date
        await evaluateUserActions(userId);

        const actions = await prisma.action.findMany({
            where: { userId, status: 'PENDING' },
            include: { asset: true }
        });

        // Sort by urgency HIGH > MEDIUM > LOW, then by creation date
        const urgencyWeight = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        actions.sort((a, b) => {
            const weightA = urgencyWeight[a.urgency] || 0;
            const weightB = urgencyWeight[b.urgency] || 0;
            if (weightA !== weightB) {
                return weightB - weightA;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        res.json({ actions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.dismissAction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const action = await prisma.action.findUnique({ where: { id } });

        if (!action) {
            return res.status(404).json({ message: 'Action not found' });
        }

        if (action.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const updatedAction = await prisma.action.update({
            where: { id },
            data: { status: 'DISMISSED' }
        });

        res.json({ message: 'Action dismissed successfully', action: updatedAction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
