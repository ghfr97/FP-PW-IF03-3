const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', verifyToken, requireAdmin, userController.getAllUsers);
router.post('/', verifyToken, requireAdmin, userController.createUser);
router.get('/customers', verifyToken, requireAdmin, userController.getCustomers);
router.put('/:id', verifyToken, requireAdmin, userController.updateUser);
router.delete('/:id', verifyToken, requireAdmin, userController.deleteUser);
router.post('/avatar', verifyToken, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;
