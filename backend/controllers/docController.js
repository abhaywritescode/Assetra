const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const llm = require('../services/llmEngine');

exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const ocrResult = await Tesseract.recognize(req.file.path, 'eng');
        const llmResponse = await llm.invoke({
            input: ocrResult.data.text
        });

        // save receipt data
        res.status(200).send(llmResponse.content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.viewDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await prisma.document.findUnique({ where: { id } });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (document.userId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const filePath = path.join(__dirname, '../uploads', document.filepath);
        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', document.mimeType);
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.status(404).json({ message: 'File not found on disk' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
