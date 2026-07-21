const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev')); // Untuk melihat log request di terminal

// --- DAFTAR MICROSERVICES URL ---
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3002';
const TRANSACTION_SERVICE_URL = process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3003';

// --- ROUTING (PROXY) ---
// 1. User Service (Mengurus Auth dan User)
app.use('/api/auth', proxy(USER_SERVICE_URL, { proxyReqPathResolver: req => '/api/auth' + req.url }));
app.use('/api/users', proxy(USER_SERVICE_URL, { proxyReqPathResolver: req => '/api/users' + req.url }));

// 2. Catalog Service (Mengurus master data jasa laundry)
app.use('/api/services', proxy(CATALOG_SERVICE_URL, { proxyReqPathResolver: req => '/api/services' + req.url }));

// 3. Transaction Service (Mengurus Order, Payment, Analytics, Notifications)
app.use('/api/orders', proxy(TRANSACTION_SERVICE_URL, { proxyReqPathResolver: req => '/api/orders' + req.url }));
app.use('/api/payments', proxy(TRANSACTION_SERVICE_URL, { proxyReqPathResolver: req => '/api/payments' + req.url }));
app.use('/api/analytics', proxy(TRANSACTION_SERVICE_URL, { proxyReqPathResolver: req => '/api/analytics' + req.url }));
app.use('/api/notifications', proxy(TRANSACTION_SERVICE_URL, { proxyReqPathResolver: req => '/api/notifications' + req.url }));

// Fallback Route
app.use('/', (req, res) => {
    res.json({ message: 'Snowwash API Gateway Berjalan dengan Baik!' });
});

app.listen(PORT, () => {
    console.log(`🚀 API Gateway berjalan di http://localhost:${PORT}`);
});
