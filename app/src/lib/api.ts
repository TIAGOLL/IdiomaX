import axios, { type AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const normalizedError = {
      message: "Erro desconhecido",
      status: error.response?.status,
      data: error.response?.data,
    };

    if (error.response?.data && typeof error.response.data === "object") {
      normalizedError.message =
        (error.response.data as { message: string }).message || normalizedError.message;
    } else if (error.message) {
      normalizedError.message = error.message;
    }

    return Promise.reject(normalizedError);
  }
);

export default api;