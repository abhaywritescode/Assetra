const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    
    // Clear existing data
    await prisma.action.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.document.deleteMany();
    await prisma.user.deleteMany();

    // Create Test User
    const passwordHash = await bcrypt.hash('password123', 12);
    const user = await prisma.user.create({
        data: {
            email: 'test@assetra.com',
            passwordHash,
            name: 'Demo User'
        }
    });

    console.log('Created User:', user.email);

    // Create Asset
    const laptop = await prisma.asset.create({
        data: {
            userId: user.id,
            name: 'ASUS ROG Gaming Laptop',
            brand: 'ASUS',
            category: 'Electronics',
            purchasePrice: 182000,
            purchaseDate: new Date('2025-09-12'),
            retailer: 'Amazon',
            serialNumber: 'SN-ASUS-12345',
            warrantyExpiry: new Date('2028-09-12'),
            currentPrice: 300000, // Show purchase advantage
            priceCheckDate: new Date()
        }
    });

    // Create Transactions
    await prisma.transaction.create({
        data: {
            userId: user.id,
            assetId: null,
            amount: 500,
            date: new Date(),
            merchant: 'Burger King',
            category: 'Food',
            source: 'UPI'
        }
    });

    await prisma.transaction.create({
        data: {
            userId: user.id,
            assetId: null,
            amount: 199,
            date: new Date(),
            merchant: 'Spotify',
            category: 'Subscriptions',
            source: 'Credit Card'
        }
    });

    // Create Action
    await prisma.action.create({
        data: {
            userId: user.id,
            assetId: laptop.id,
            type: 'WARRANTY_EXPIRY',
            title: 'Extend ASUS Laptop Warranty',
            description: 'Your warranty expires in 2 years. Consider an extended plan.',
            urgency: 'MEDIUM'
        }
    });

    console.log('Database seeded successfully.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
