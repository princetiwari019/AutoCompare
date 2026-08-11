import api from './api';

// Admin Auth APIs
export const loginAdmin = async (email, password) => {
  const response = await api.post('/admin/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('adminToken', response.data.token);
    localStorage.setItem('adminUser', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const changeAdminPassword = async (currentPassword, newPassword, confirmPassword) => {
  const response = await api.post('/admin/auth/change-password', {
    currentPassword,
    newPassword,
    confirmPassword
  });
  return response.data;
};

export const logoutAdmin = async () => {
  try {
    await api.post('/admin/auth/logout');
  } catch (e) {
    // Ignore error on logout
  } finally {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }
};

export const getCurrentAdmin = async () => {
  const response = await api.get('/admin/auth/me');
  return response.data;
};

// Admin Vehicle CRUD APIs
export const fetchAdminVehicles = async (params = {}) => {
  const response = await api.get('/admin/vehicles', { params });
  return response.data;
};

export const fetchAdminVehicleById = async (id) => {
  const response = await api.get(`/admin/vehicles/${id}`);
  return response.data;
};

export const createAdminVehicle = async (vehicleData) => {
  const response = await api.post('/admin/vehicles', vehicleData);
  return response.data;
};

export const updateAdminVehicle = async (id, vehicleData) => {
  const response = await api.put(`/admin/vehicles/${id}`, vehicleData);
  return response.data;
};

export const deleteAdminVehicle = async (id) => {
  const response = await api.delete(`/admin/vehicles/${id}`);
  return response.data;
};

// Admin Media Management APIs
export const uploadAdminVehicleImage = async (id, formData) => {
  const response = await api.post(`/admin/vehicles/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteAdminVehicleImage = async (id, category, imageUrl) => {
  const response = await api.delete(`/admin/vehicles/${id}/images`, {
    data: { category, imageUrl }
  });
  return response.data;
};

export const reorderAdminVehicleImages = async (id, category, images) => {
  const response = await api.put(`/admin/vehicles/${id}/images/reorder`, {
    category,
    images
  });
  return response.data;
};

export const validateAdminVehicleImages = async (id) => {
  const response = await api.post(`/admin/vehicles/${id}/validate`);
  return response.data;
};

// Legacy Export Aliases for AdminMediaManager compatibility
export const uploadVehicleImage = uploadAdminVehicleImage;
export const deleteVehicleImage = deleteAdminVehicleImage;
export const reorderVehicleImages = reorderAdminVehicleImages;
export const validateVehicleImages = validateAdminVehicleImages;
