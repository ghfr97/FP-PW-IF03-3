const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/customers', verifyToken, requireAdmin, userController.getCustomers);
router.post('/avatar', verifyToken, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;
