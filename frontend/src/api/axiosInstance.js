import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Request Interceptor to attach JWT Token safely from userInfo storage
API.interceptors.request.use((config) => {
  try {
    const item = localStorage.getItem('userInfo');
    const userInfo = (item && item !== 'undefined' && item !== 'null')
      ? JSON.parse(item)
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  } catch (err) {
    console.error('Error parsing userInfo from localStorage in interceptor:', err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;