import api from './api';

// NGO Verification
export const getPendingOrganizations = async () => {
  const response = await api.get('/admin/organizations/pending');
  return response.data;
};

export const verifyOrganization = async (id) => {
  const response = await api.put(`/admin/organizations/${id}/verify`);
  return response.data;
};

// Analytics
export const getSystemStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// User Management
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.put(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};