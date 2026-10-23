import api from './axios';

const MEMBER_TOKEN_KEY = 'member_token';

export const getMemberToken = () => localStorage.getItem(MEMBER_TOKEN_KEY);
export const setMemberToken = (token) => localStorage.setItem(MEMBER_TOKEN_KEY, token);
export const removeMemberToken = () => localStorage.removeItem(MEMBER_TOKEN_KEY);

const memberHeaders = () => ({
  headers: { Authorization: `MemberBearer ${getMemberToken()}` },
});

export const portalRegister = (data) => api.post('/portal/register/', data);
export const portalLogin = (data) => api.post('/portal/login/', data);
export const portalMe = () => api.get('/portal/me/', memberHeaders());
export const portalCheckIn = () => api.post('/portal/checkin/', {}, memberHeaders());
export const portalAttendance = () => api.get('/portal/attendance/', memberHeaders());
