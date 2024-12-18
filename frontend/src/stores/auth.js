import { reactive, computed } from 'vue';
import axios from 'axios';

const state = reactive({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
});

export const useAuthStore = () => {
  const isAuthenticated = computed(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return !!token && !!user;
  });

  const currentUser = computed(() => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  });

  const getToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : null;
  };

  const setAuth = (data) => {
    const token = data.token.startsWith('Bearer ') ? data.token.split(' ')[1] : data.token;
    state.token = token;
    state.user = data.user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      setAuth(response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/signup';
  };

  return {
    token: computed(() => getToken()),
    user: computed(() => state.user),
    isAuthenticated,
    currentUser,
    login,
    logout,
    setAuth
  };
}; 