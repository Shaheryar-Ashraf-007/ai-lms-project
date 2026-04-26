import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API}/api`, 
  withCredentials: true,
});

// ✅ Runs before every request and injects the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;