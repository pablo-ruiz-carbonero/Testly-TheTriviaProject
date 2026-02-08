// src/api/api.ts
import axios from "axios";
const api = axios.create({
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para loggear errores
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err.response);
    return Promise.reject(err);
  },
);

export default api;
