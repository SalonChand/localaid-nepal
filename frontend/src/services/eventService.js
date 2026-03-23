import api from './api';

export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const getUpcomingEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

// NEW RSVP API CALL
export const rsvpEvent = async (eventId) => {
  const response = await api.post(`/events/${eventId}/rsvp`);
  return response.data;
};