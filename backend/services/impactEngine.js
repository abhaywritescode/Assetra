const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const calculateUserImpact = async (userId) => {
    const now = new Date();

    // 1. Fetch user's assets
    const assets = await prisma.asset.findMany({
        where: { userId }
    });

    let protectedValue = 0;
    let purchaseAdvantageTotal = 0;

    assets.forEach(asset => {
        // Protected Value: sum of purchasePrice for assets with active warranty
        if (asset.warrantyExpiry && new Date(asset.warrantyExpiry) > now) {
            protectedValue += asset.purchasePrice;
        }

        // Purchase Advantage: sum of (currentPrice - purchasePrice) when current > purchase
        if (asset.currentPrice && asset.currentPrice > asset.purchasePrice) {
            purchaseAdvantageTotal += (asset.currentPrice - asset.purchasePrice);
        }
    });

    // 3. Fetch user's transactions and aggregate by category
    const transactions = await prisma.transaction.findMany({
        where: { userId }
    });

    const categorizedExpenditure = transactions.reduce((acc, tx) => {
        if (!acc[tx.category]) {
            acc[tx.category] = 0;
        }
        acc[tx.category] += tx.amount;
        return acc;
    }, {});

    return {
        protectedValue,
        purchaseAdvantageTotal,
        categorizedExpenditure
    };
};

module.exports = {
    calculateUserImpact
};
