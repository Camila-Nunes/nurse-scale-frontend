import axios from 'axios';

const api = axios.create({
  //baseURL: 'https://localhost:55759' // Substitua pela URL do seu backend
  baseURL: 'https://camilanunes-001-site2.ctempurl.com/'
});

export default api; 