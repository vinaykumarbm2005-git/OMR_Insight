import api from './api';

export const authService = {
  login: async (credentials) => {
    // Example: return await api.post('/auth/login', credentials);
    console.log('Login placeholder using', api.defaults.baseURL);
    return new Promise(resolve => setTimeout(() => resolve({ token: 'dummy_token' }), 1000));
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  verifyToken: async () => {
    // Example: return await api.get('/auth/verify');
    return true;
  }
};
