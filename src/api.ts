import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:55759' // Substitua pela URL do seu backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt-Token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
