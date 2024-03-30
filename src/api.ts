import axios from 'axios';

const api = axios.create({
  baseURL: 'https://camilanunes-001-site1.ctempurl.com'
  //baseURL: 'https://localhost:55759/'
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
