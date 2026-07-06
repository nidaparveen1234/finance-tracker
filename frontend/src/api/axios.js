import axios from 'axios';

// Algorithm:
// Every request automatically gets:
// 1. The base URL so we don't repeat it everywhere
// 2. The token from localStorage attached to headers

const instance = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// This runs before every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;