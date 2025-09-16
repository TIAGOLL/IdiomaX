import axios, { type AxiosError } from "axios";
import nookies from 'nookies';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers:
  {
    "Content-Type": "application/json",
  },
});
console.log(import.meta.env.VITE_API_URL);
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

    if (error.response?.data && typeof error.response.data === "object") {
      normalizedError.message =
        (error.response.data as { message: string }).message || normalizedError.message;
    } else if (error.message) {
      normalizedError.message = error.message;
    }
    return Promise.reject(normalizedError);
  }
);
