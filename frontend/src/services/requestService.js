import api from './api';

export const createSupportRequest = async (requestData) => {
  const response = await api.post('/support-requests', requestData);
  return response.data;
};

export const getMyRequests = async () => {
  const response = await api.get('/support-requests/my-requests');
  return response.data;
};