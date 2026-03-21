import api from './api';

export const getPendingOrganizations = async () => {
  const response = await api.get('/admin/organizations/pending');
  return response.data;
};

export const verifyOrganization = async (id) => {
  const response = await api.put(`/admin/organizations/${id}/verify`);
  return response.data;
};