import axios from 'axios';


const api = axios.create({
  //baseURL: 'https://localhost:55759' // Substitua pela URL do seu backend
  baseURL: 'http://nuersescales.com.br/'
});

export default api; 