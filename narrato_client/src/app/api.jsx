import axios from 'axios';
import { store } from './store';

import { logout } from './slice/authSlice';
const createAxiosInstance = () => {
  const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;
        
        if (refreshToken) {
          try {
            const response = await axios.post(
              'http://localhost:8000/api/token/refresh/',
              {
                refresh: refreshToken,
              }
            );
            
            const newAccessToken = response.data.access;
            store.dispatch(
              setCredentials({
                ...state.auth.user,
                access: newAccessToken,
                refresh: refreshToken,
              })
            );
            
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            store.dispatch(logout());
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        } else {
          store.dispatch(logout());
          window.location.href = '/login';
          return Promise.reject(new Error('No refresh token available'));
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const api = createAxiosInstance();