const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');

// Main recommendation route
router.post('/', getRecommendations);

module.exports = router;
