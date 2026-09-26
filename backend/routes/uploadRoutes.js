const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    // Unique filename to prevent overwriting during concurrent uploads
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

// File Validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB Limit
  fileFilter
});

router.post('/', requireAuth, upload.array('receipts', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded or files were rejected." });
    }

    const userId = req.user.id;
    const documentRecords = [];

    // Save metadata for each file to database
    for (const file of req.files) {
      // 1. Generate SHA-256 hash of the uploaded file
      const fileBuffer = fs.readFileSync(file.path);
      const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // 2. Check for existing file with exact same hash for this user
      const existingDoc = await prisma.document.findFirst({
        where: { userId, fileHash }
      });

      if (existingDoc) {
        // Backend Duplicate Protection: Skip saving and safely delete redundant file
        fs.unlinkSync(file.path);
        documentRecords.push(existingDoc); // Return existing record so frontend succeeds
      } else {
        // Save new file to DB
        const document = await prisma.document.create({
          data: {
            userId,
            filename: file.originalname,
            filepath: file.path,
            mimeType: file.mimetype,
            fileSize: file.size,
            fileHash
          }
        });
        documentRecords.push(document);
      }
    }

    res.status(200).json({ 
      message: "Files processed successfully. Ready for AI extraction.", 
      files: documentRecords 
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "An internal server error occurred during upload." });
  }
});

// Error handling middleware specifically for multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large. Max size is 15MB.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;
