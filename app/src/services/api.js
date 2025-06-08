import axios from 'axios';

const api = axios.create({
  baseURL: 'https://6845f048fc51878754dc94cb.mockapi.io',
  timeout: 5000,
});

export default api;
