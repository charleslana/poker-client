import axios, { AxiosError } from 'axios';
import { getAccessToken, removeAccessToken } from '@/utils/localStorageUtils';

const api = axios.create({
  baseURL: process.env.API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 429) {
        removeAccessToken();
        location.reload();
        return;
      }
      if (error.response.status === 403 || error.response.status === 422) {
        const url = error!.config!.url!;
        if (!url.includes('user/auth')) {
          location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
