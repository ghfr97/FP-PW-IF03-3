const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createOrderSchema, updateOrderStatusSchema, adminCreateOrderSchema } = require('../utils/validations/orderValidation');

router.post('/', verifyToken, validateRequest(createOrderSchema), orderController.createOrder);
router.post('/checkout', verifyToken, validateRequest(createOrderSchema), orderController.createOrderAndPayment);
router.get('/me', verifyToken, orderController.getMyOrders);

// Akses Khusus Admin
router.post('/admin', verifyToken, requireAdmin, validateRequest(adminCreateOrderSchema), orderController.createOrderAdmin);
router.get('/all', verifyToken, requireAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, requireAdmin, validateRequest(updateOrderStatusSchema), orderController.updateOrderStatus);
router.delete('/:id', verifyToken, requireAdmin, orderController.deleteOrder);

// Rute untuk mengecek fitur Advanced Database
router.get('/summary', verifyToken, requireAdmin, orderController.getUserOrderSummary);
router.post('/apply-discount', verifyToken, requireAdmin, orderController.applyDiscount);

module.exports = router;
