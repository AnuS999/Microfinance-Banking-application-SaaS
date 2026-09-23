// frontend/src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically pass JWT token from localStorage in Authorization header
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getAllLoans = () => API.get('/loans');

export const getLoanById = (id) => API.get(`/loans/${id}`);
export const getLoans = () => API.get('/loans');
export const approveLoan = (id) => API.patch(`/loans/${id}/approve`);
export const disburseLoan = (id) => API.patch(`/loans/${id}/disburse`);
export const repayInstallment = (id, data) => API.post(`/loans/${id}/repay`, data);

export default API;