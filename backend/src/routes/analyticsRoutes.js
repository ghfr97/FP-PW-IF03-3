const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/dashboard', verifyToken, requireAdmin, analyticsController.getDashboardStats);

module.exports = router;
