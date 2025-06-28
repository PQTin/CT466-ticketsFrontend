import axios from "axios";

// Tạo instance axios riêng
const api = axios.create({
  baseURL: "/api", // Proxy đã cấu hình trong vite.config.js
  timeout: 10000, // Timeout 10s
});

// Gắn token tự động vào headers nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
