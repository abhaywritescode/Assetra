const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage, AIMessage, SystemMessage } = require('@langchain/core/messages');

exports.query = async (req, res) => {
    try {
        const { messages } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages array." });
        }

        // 1. Fetch context for the user (RAG-lite)
        const assets = await prisma.asset.findMany({
            where: { userId: req.user.id },
            include: { document: true }
        });
        
        const receipts = await prisma.document.findMany({
            where: { userId: req.user.id }
        });

        const userData = {
            totalAssets: assets.length,
            totalReceipts: receipts.length,
            assets: assets.map(a => ({
                name: a.name,
                brand: a.brand,
                category: a.category,
                price: a.purchasePrice,
                purchaseDate: a.purchaseDate,
                warrantyExpiry: a.warrantyExpiry,
                returnWindowExpiry: a.returnWindowExpiry,
                subscriptionRenewal: a.subscriptionRenewal,
                receipt: a.document ? a.document.retailerName : 'Unknown'
            })),
            receipts: receipts.map(r => ({
                filename: r.filename,
                retailer: r.retailerName || 'Unknown',
                purchaseDate: r.purchaseDate,
                totalAmount: r.totalAmount,
                paymentMethod: r.paymentMethod
            }))
        };

        const contextStr = JSON.stringify(userData, null, 2);
        
        // 2. Build the System Prompt
        const systemPromptText = `You are the Assetra Assistant, a specialized AI for managing receipts, assets, and warranties.
Use the following JSON data of the user's inventory to answer their questions.
Be concise, helpful, and friendly. Do not invent data outside of this context unless it's general knowledge.

User's Data Context:
${contextStr}
`;

        const langchainMessages = [
            new SystemMessage(systemPromptText),
            ...messages.map(m => m.role === 'assistant' ? new AIMessage(m.content) : new HumanMessage(m.content))
        ];

        // 3. Call the LLM
        const model = new ChatGoogleGenerativeAI({
            model: 'gemini-3.5-flash-lite',
            temperature: 0.7
        });

        const llmResponse = await model.invoke(langchainMessages);

        res.json({
            role: 'assistant',
            content: llmResponse.content
        });
        
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error.message });
    }
};
