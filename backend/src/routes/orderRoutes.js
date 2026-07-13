const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, orderController.createOrder);
router.get('/me', verifyToken, orderController.getMyOrders);

// Akses Khusus Admin
router.get('/all', verifyToken, requireAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, requireAdmin, orderController.updateOrderStatus);

// Rute untuk mengecek fitur Advanced Database
router.get('/summary', verifyToken, requireAdmin, orderController.getUserOrderSummary);
router.post('/apply-discount', verifyToken, requireAdmin, orderController.applyDiscount);

module.exports = router;
