import api from './axios';
export const checkIn = (data) => api.post('/attendance/checkin/', data);
export const getAttendance = (params) => api.get('/attendance/', { params });
