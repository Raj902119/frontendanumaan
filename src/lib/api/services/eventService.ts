import apiClient from '../client';

interface EventQueryParams {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const eventService = {
  getEvents: async (params?: EventQueryParams) => {
    const response = await apiClient.get('/events', { params });
    return response.data;
  },
  
  getEventById: async (eventId: string) => {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data;
  },
  
  getEventOrders: async (eventId: string) => {
    const response = await apiClient.get(`/events/${eventId}/orders`);
    return response.data;
  }
};
