const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, requireAdmin, notificationController.getUnreadNotifications);
router.post('/', verifyToken, requireAdmin, notificationController.createNotification);
router.patch('/:id/read', verifyToken, requireAdmin, notificationController.markAsRead);

module.exports = router;
