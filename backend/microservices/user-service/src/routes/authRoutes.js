const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { registerSchema, loginSchema, updateProfileSchema } = require('../utils/validations/authValidation');

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.me);
router.put('/profile', verifyToken, validateRequest(updateProfileSchema), authController.updateProfile);

module.exports = router;
