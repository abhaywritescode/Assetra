import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error is 401, we haven't retried yet, and it's not the refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/auth/refresh') {
      originalRequest._retry = true;
      try {
        const refreshRes = await api.post('/api/auth/refresh');
        const { accessToken } = refreshRes.data;
        
        // Update global defaults for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Update the failed request and retry it
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expired or is missing
        delete api.defaults.headers.common['Authorization'];
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
