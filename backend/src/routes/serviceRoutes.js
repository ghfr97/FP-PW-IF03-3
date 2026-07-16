const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createServiceSchema, updateServiceSchema } = require('../utils/validations/serviceValidation');

router.get('/', serviceController.getAllServices); // Public bisa lihat layanan
router.post('/', verifyToken, requireAdmin, upload.single('image'), validateRequest(createServiceSchema), serviceController.createService);
router.put('/:id', verifyToken, requireAdmin, upload.single('image'), validateRequest(updateServiceSchema), serviceController.updateService);
router.delete('/:id', verifyToken, requireAdmin, serviceController.deleteService);

module.exports = router;
