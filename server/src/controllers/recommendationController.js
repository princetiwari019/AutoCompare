const Vehicle = require('../models/Vehicle');
const { calculateRecommendations } = require('../services/recommendationService');

// @desc    Generate personalized vehicle recommendations based on user priorities & budget
// @route   POST /api/recommendations
// @access  Public
const getRecommendations = async (req, res, next) => {
  try {
    const { type, vehicleType, minPrice, maxPrice, weights } = req.body;

    // 1. Validate vehicle type
    const selectedType = type || vehicleType;
    if (!selectedType || (selectedType !== 'car' && selectedType !== 'bike')) {
      return res.status(400).json({
        success: false,
        message: "Type must be 'car' or 'bike'"
      });
    }

    // 2. Validate price budget bounds
    const minP = Number(minPrice);
    const maxP = Number(maxPrice);

    if (isNaN(minP) || isNaN(maxP) || minP <= 0 || maxP <= 0 || minP > maxP) {
      return res.status(400).json({
        success: false,
        message: 'minPrice and maxPrice must be positive numbers, and minPrice cannot exceed maxPrice'
      });
    }

    // 3. Validate weights object
    if (!weights || typeof weights !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'weights object is required'
      });
    }

    const {
      price = 0,
      mileage = 0,
      safety = 0,
      performance = 0,
      features = 0
    } = weights;

    const numPrice = Number(price);
    const numMileage = Number(mileage);
    const numSafety = Number(safety);
    const numPerf = Number(performance);
    const numFeatures = Number(features);

    // Check for NaN or negative weights
    if (
      isNaN(numPrice) || numPrice < 0 ||
      isNaN(numMileage) || numMileage < 0 ||
      isNaN(numSafety) || numSafety < 0 ||
      isNaN(numPerf) || numPerf < 0 ||
      isNaN(numFeatures) || numFeatures < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Weights must be non-negative numbers'
      });
    }

    // Check that weights total exactly 100
    const totalWeights = numPrice + numMileage + numSafety + numPerf + numFeatures;
    if (Math.round(totalWeights) !== 100) {
      return res.status(400).json({
        success: false,
        message: `Weights must total exactly 100. Current total is ${totalWeights}`
      });
    }

    // 4. Query candidate vehicles strictly matching type and budget from MongoDB
    const query = {
      type: selectedType,
      price: { $gte: minP, $lte: maxP }
    };

    const candidateVehicles = await Vehicle.find(query);

    if (!candidateVehicles || candidateVehicles.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: 'No vehicles found in the selected price range'
      });
    }

    // 5. Process candidates through pure decoupled recommendation engine
    const recommendations = calculateRecommendations(candidateVehicles, {
      price: numPrice,
      mileage: numMileage,
      safety: numSafety,
      performance: numPerf,
      features: numFeatures
    });

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
