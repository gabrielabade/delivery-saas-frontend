import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Configuração da API
 * Em desenvolvimento: http://localhost:3000/api (proxy do Vite)
 * Em produção: https://folkz.website (direto)
 */
const isDevelopment = import.meta.env.VITE_NODE_ENV === 'development';
const baseURL = import.meta.env.VITE_API_URL ||
  (isDevelopment ? 'http://localhost:3000/api' : 'https://folkz.website');

console.log('🔧 API Config:', { baseURL, isDevelopment });

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Interceptor de request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    console.error("❌ Erro API:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });

    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;