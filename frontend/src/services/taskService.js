import api from './api';

export const getAvailableTasks = async () => {
  const response = await api.get('/tasks/available');
  return response.data;
};

export const acceptTask = async (requestId) => {
  const response = await api.post(`/tasks/${requestId}/accept`);
  return response.data;
};

// --- NEW FUNCTIONS ---
export const getMyAssignedTasks = async () => {
  const response = await api.get('/tasks/my-tasks');
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.put(`/tasks/${taskId}/status`, { status });
  return response.data;
};