import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000/api",
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("autodata_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
