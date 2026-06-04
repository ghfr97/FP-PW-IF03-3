const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/', serviceController.getAllServices); // Public bisa lihat layanan
router.post('/', verifyToken, requireAdmin, serviceController.createService);

module.exports = router;
