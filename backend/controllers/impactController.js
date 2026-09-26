const { calculateUserImpact } = require('../services/impactEngine');

exports.getImpactSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const impactSummary = await calculateUserImpact(userId);
        res.json(impactSummary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
