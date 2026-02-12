import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081", // 🔥 ESTA ES LA CLAVE
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✔️ sesión JSESSIONID
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err.response);
    return Promise.reject(err);
  },
);

export default api;
