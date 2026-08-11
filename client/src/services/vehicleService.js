import api from './api';

export const fetchVehicles = async (params = {}) => {
  const response = await api.get('/vehicles', { params });
  return response.data;
};

export const fetchVehicleById = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

export const fetchVehiclesForCompare = async (ids = []) => {
  if (ids.length === 0) return { data: [] };
  const response = await api.get('/vehicles/compare', {
    params: { ids: ids.join(',') }
  });
  return response.data;
};

export const fetchFilterMetadata = async (vehicleType = '') => {
  const response = await api.get('/vehicles/meta/filters', {
    params: { vehicleType }
  });
  return response.data;
};

export const fetchRecommendations = async (payload) => {
  const response = await api.post('/recommendations', payload);
  return response.data;
};
