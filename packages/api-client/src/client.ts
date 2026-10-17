import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { AppError } from './error';

const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:4010/api/v1';

let authTokenProvider: (() => string | null) | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function configureAuth(options: {
  getToken: () => string | null;
  onUnauthorized: () => void;
}) {
  authTokenProvider = options.getToken;
  unauthorizedHandler = options.onUnauthorized;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authTokenProvider ? authTokenProvider() : localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(AppError.fromAxiosError(error))
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError = AppError.fromAxiosError(error);
    if (appError.statusCode === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(appError);
  }
);
