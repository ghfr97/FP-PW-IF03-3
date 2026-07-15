import { create } from 'zustand';
import api, { setAccessToken } from '../lib/axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      // First attempt to get the user.
      // If the access token is missing or expired, the axios interceptor
      // will automatically try to refresh it before retrying this request.
      const response = await api.get('/auth/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // If both the request and the refresh failed, we are not logged in.
      setAccessToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (newData) => {
    set((state) => ({ user: { ...state.user, ...newData } }));
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    // Save the access token to axios for future requests
    setAccessToken(response.data.accessToken);
    set({ user: response.data.user, isAuthenticated: true });
    return response.data;
  },

  logout: async () => {
    try {
        await api.post('/auth/logout');
    } catch (err) {
        console.error("Logout failed", err);
    } finally {
        setAccessToken(null);
        set({ user: null, isAuthenticated: false });
    }
  }
}));

export default useAuthStore;
