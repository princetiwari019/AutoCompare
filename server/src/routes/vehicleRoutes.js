const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  compareVehicles,
  getFilterMeta
} = require('../controllers/vehicleController');

// Main vehicle routes
router.get('/', getVehicles);
router.get('/compare', compareVehicles);
router.get('/meta/filters', getFilterMeta);
router.get('/:id', getVehicleById);

module.exports = router;
