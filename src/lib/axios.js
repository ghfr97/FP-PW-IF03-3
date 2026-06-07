import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Sesuaikan dengan port backend
  withCredentials: true // PENTING: Agar JWT di dalam HttpOnly Cookie terkirim
});

export default api;
