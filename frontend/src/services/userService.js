import api from './api';

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};