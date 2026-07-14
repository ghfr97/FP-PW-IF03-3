const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables dari file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARES
// ==========================================
// 1. Keamanan Header
app.use(helmet());

// 2. CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true // Mengizinkan cookie untuk JWT
}));

// 3. Body & Cookie Parser
app.use(express.json()); // Membaca body JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Membaca HttpOnly Cookies

// 4. Rate Limiting (Mencegah DDoS/Brute Force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Batas maksimal 100 request per 15 menit dari 1 IP
    message: "Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit."
});
app.use(limiter);

// ==========================================
// ROUTES (Test Route)
// ==========================================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Snowwash Backend Server is running perfectly! 🚀'
    });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
