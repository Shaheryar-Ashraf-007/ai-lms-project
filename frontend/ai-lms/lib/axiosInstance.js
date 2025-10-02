import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // Replace with your API base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get the token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;