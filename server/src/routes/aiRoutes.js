const express = require('express');
const router = express.Router();
const { chatWithAdvisor, explainRecommendation, summarizeComparison } = require('../controllers/aiController');
const { aiRateLimiter } = require('../middleware/securityMiddleware');

router.post('/chat', aiRateLimiter, chatWithAdvisor);
router.post('/recommendation-explanation', aiRateLimiter, explainRecommendation);
router.post('/comparison-summary', aiRateLimiter, summarizeComparison);

module.exports = router;
