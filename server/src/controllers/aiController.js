const { generateAdvisorResponse, generateRecommendationExplanation, generateComparisonSummary } = require('../services/aiAdvisorService');

// @desc    Process user chat prompt and return grounded multilingual vehicle advice
// @route   POST /api/ai/chat
// @access  Public
const chatWithAdvisor = async (req, res, next) => {
  try {
    const { message, history = [], vehicleId = null, recommendationContext = null } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid text message prompt'
      });
    }

    const advisorResult = await generateAdvisorResponse({
      message: message.trim(),
      history,
      vehicleId,
      recommendationContext
    });

    res.status(200).json({
      success: true,
      detectedLanguage: advisorResult.language,
      reply: advisorResult.reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI explanation for an already calculated recommendation
// @route   POST /api/ai/recommendation-explanation
// @access  Public
const explainRecommendation = async (req, res, next) => {
  try {
    const { vehicleId, vehicle, recommendation, userPreferences, language = 'hinglish' } = req.body;

    const targetId = vehicleId || vehicle?._id;

    if (!targetId) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID or vehicle object is required'
      });
    }

    const result = await generateRecommendationExplanation({
      vehicleId: targetId,
      recommendation,
      userPreferences,
      language
    });

    res.status(200).json({
      success: true,
      detectedLanguage: result.language,
      explanation: result.explanation,
      finalScore: result.finalScore,
      rank: result.rank,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI comparison summary for selected vehicles
// @route   POST /api/ai/comparison-summary
// @access  Public
const summarizeComparison = async (req, res, next) => {
  try {
    const { vehicleIds = [], language = 'hinglish' } = req.body;

    if (!Array.isArray(vehicleIds) || vehicleIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 vehicle IDs are required to generate an AI comparison summary'
      });
    }

    const result = await generateComparisonSummary({
      vehicleIds,
      language
    });

    res.status(200).json({
      success: true,
      detectedLanguage: result.language,
      summary: result.summary,
      bestForInsights: result.bestForInsights,
      tradeOffs: result.tradeOffs,
      vehiclesCount: result.vehiclesCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatWithAdvisor,
  explainRecommendation,
  summarizeComparison
};
