import axios from 'axios';

const api = axios.create({
  baseURL: 'https://camilanunes-001-site3.ctempurl.com'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt-Token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

console.log(process.env.NEXT_PUBLIC_API_URL);

export default api;
