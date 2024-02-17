import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:55759' // Substitua pela URL do seu backend
  //baseURL: 'https://camilanunes-001-site3.ctempurl.com'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt-Token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
