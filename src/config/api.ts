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

const reloadStatusCodes = [401, 403, 422, 429];

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && reloadStatusCodes.includes(error.response.status)) {
      const url = error!.config!.url;
      if (!url || !url.includes('auth/login')) {
        location.reload();
        removeAccessToken();
        return;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
