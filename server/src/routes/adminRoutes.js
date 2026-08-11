const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protectAdmin } = require('../middleware/authMiddleware');
const { validateObjectId, uploadRateLimiter } = require('../middleware/securityMiddleware');
const {
  getAdminVehicles,
  getAdminVehicleById,
  createAdminVehicle,
  updateAdminVehicle,
  deleteAdminVehicle,
  uploadVehicleImage,
  deleteVehicleImage,
  reorderVehicleImages,
  validateVehicleImages
} = require('../controllers/adminController');

// All admin routes below require authentication & admin role
router.use(protectAdmin);

router.get('/vehicles', getAdminVehicles);
router.get('/vehicles/:id', validateObjectId('id'), getAdminVehicleById);
router.post('/vehicles', createAdminVehicle);
router.put('/vehicles/:id', validateObjectId('id'), updateAdminVehicle);
router.delete('/vehicles/:id', validateObjectId('id'), deleteAdminVehicle);

// Media endpoints
router.post('/vehicles/:id/images', validateObjectId('id'), uploadRateLimiter, upload.single('image'), uploadVehicleImage);
router.delete('/vehicles/:id/images', validateObjectId('id'), deleteVehicleImage);
router.put('/vehicles/:id/images/reorder', validateObjectId('id'), reorderVehicleImages);
router.post('/vehicles/:id/validate', validateObjectId('id'), validateVehicleImages);

module.exports = router;
