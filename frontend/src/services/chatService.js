import api from './api';

export const getTaskMessages = async (taskId) => {
  const response = await api.get(`/chat/${taskId}`);
  return response.data;
};