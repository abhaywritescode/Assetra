const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.query = async (req, res) => {
    try {
        const { question } = req.body;
        
        // Fetch context for the user
        const assets = await prisma.asset.findMany({
            where: { userId: req.user.id },
            include: { document: true }
        });

        // Normally we'd call the LLM here (Friend 2's AI service)
        // Here we simulate the grounded RAG response for demo purposes
        
        const contextStr = assets.map(a => 
            `- ${a.name}: ₹${a.purchasePrice} | Purchased: ${new Date(a.purchaseDate).toDateString()} | Warranty Expiry: ${a.warrantyExpiry ? new Date(a.warrantyExpiry).toDateString() : 'N/A'} | Source: ${a.document ? a.document.filename : 'Unknown'}`
        ).join('\n');
        
        const systemPrompt = `Context:\n${contextStr}\n\nUser Question: "${question}"\nConstraint: Answer only using context. Include document provenance.`;
        
        // Mocking the LLM generation:
        const answer = "Based on your context, the mock response is generated here. Your warranty expires soon.";
        
        res.json({
            answer,
            provenance: {
                verified: true,
                sourceDocumentId: assets.length > 0 && assets[0].document ? assets[0].document.id : null,
                sourceSnippet: "Extracted from context"
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
