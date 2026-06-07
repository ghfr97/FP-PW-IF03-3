const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/customers', verifyToken, requireAdmin, userController.getCustomers);

module.exports = router;
