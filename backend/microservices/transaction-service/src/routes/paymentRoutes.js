const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route khusus untuk Midtrans Webhook (TIDAK BOLEH PAKAI verifyToken)
router.post('/webhook', paymentController.handleMidtransNotification);

module.exports = router;
