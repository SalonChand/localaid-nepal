import api from './api';

export const getOrganizations = async () => {
  const response = await api.get('/organizations');
  return response.data;
};

export const getMyOrganization = async () => {
  const response = await api.get('/organizations/me');
  return response.data;
};

export const createOrganization = async (orgData) => {
  const response = await api.post('/organizations', orgData);
  return response.data;
};

export const updateOrganization = async (orgData) => {
  const response = await api.put('/organizations/me', orgData);
  return response.data;
};