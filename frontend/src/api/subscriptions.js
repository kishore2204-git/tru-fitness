import api from './axios';
export const getSubscriptions = (params) => api.get('/subscriptions/', { params });
export const createSubscription = (data) => api.post('/subscriptions/', data);
