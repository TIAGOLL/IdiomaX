import axios, { type AxiosError } from "axios";
import nookies from 'nookies';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers:
  {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = nookies.get(null, 'token').token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const normalizedError = {
      message: "Erro desconhecido",
      status: error.response?.status,
      data: error.response?.data,
    };
    console.log(error);

    // 401 = Token inválido/expirado → Redirecionar para login
    if (error.response?.status === 401) {
      nookies.destroy(null, 'token', { path: '/' });
      // Só redireciona se não estiver já na página de login
      if (!window.location.pathname.includes('/auth/sign-in')) {
        window.location.href = '/auth/sign-in';
      }
    }

    if (error.response?.data && typeof error.response.data === "object") {
      normalizedError.message =
        (error.response.data as { message: string }).message || normalizedError.message;
    } else if (error.message) {
      normalizedError.message = error.message;
    }
    return Promise.reject(normalizedError);
  }
);
