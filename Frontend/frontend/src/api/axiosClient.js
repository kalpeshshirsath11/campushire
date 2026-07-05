import axios from 'axios';
import toast from 'react-hot-toast';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8083/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token automatically
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campushire_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global error parsing & 401 Session Expiry redirection
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Dispatch event to context provider to clear state and trigger redirect
        window.dispatchEvent(new Event('campushire_logout'));
        toast.error('Session expired. Please log in again.');
      } else if (status === 403) {
        if (data?.message === "Password change required on first login") {
          // Do not spam toast, the guard will handle redirecting the user
        } else {
          toast.error('Access Denied: You do not have permission.');
        }
      } else if (status !== 400 && status !== 404) {
        // General error toast, except for validation errors or resource not found (handled inline)
        toast.error(data?.message || 'Server error occurred.');
      }
    } else {
      toast.error('Network Error: Cannot connect to the server.');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
