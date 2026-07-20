import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // PENTING: Agar JWT di dalam HttpOnly Cookie terkirim
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

// Tambahkan token ke header Authorization sebelum request dikirim
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Tangkap response error (khususnya 401) untuk mencoba refresh token
api.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;
  
  // Jika error 401, belum pernah diretry, dan bukan dari endpoint login/refresh itu sendiri
  if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/refresh') {
    originalRequest._retry = true;
    
    try {
      // Gunakan axios biasa agar tidak masuk ke interceptor api ini (menghindari infinite loop)
      const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
      accessToken = res.data.accessToken;
      
      // Update header request asli dengan token baru
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      
      // Ulangi request asli
      return api(originalRequest);
    } catch (refreshError) {
      // Jika refresh gagal, reset token. AuthStore akan mendeteksi auth gagal.
      accessToken = null;
      return Promise.reject(refreshError);
    }
  }
  
  return Promise.reject(error);
});

export default api;
