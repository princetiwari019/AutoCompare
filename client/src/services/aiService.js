import api from './api';

export const sendChatMessage = async ({ message, history = [], vehicleId = null }) => {
  const response = await api.post('/ai/chat', {
    message,
    history,
    vehicleId
  });
  return response.data;
};

export const fetchRecommendationExplanation = async ({
  vehicleId,
  vehicle,
  recommendation,
  userPreferences,
  language = 'hinglish'
}) => {
  const response = await api.post('/ai/recommendation-explanation', {
    vehicleId,
    vehicle,
    recommendation,
    userPreferences,
    language
  });
  return response.data;
};

export const fetchComparisonSummary = async ({ vehicleIds, language = 'hinglish' }) => {
  const response = await api.post('/api/ai/comparison-summary', {
    vehicleIds,
    language
  });
  return response.data;
};
