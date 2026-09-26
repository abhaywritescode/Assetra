const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/authRoutes');
const docRoutes = require('./routes/docRoutes');
const chatRoutes = require('./routes/chatRoutes');
const actionRoutes = require('./routes/actionRoutes');
const impactRoutes = require('./routes/impactRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/documents', docRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/upload', uploadRoutes);

// Basic health check
app.get('/', (req, res) => {
    res.json({ message: 'Assetra API is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
