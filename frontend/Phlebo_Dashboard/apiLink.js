import axios from "axios";
import camelcaseKeys from "camelcase-keys";

const api_url = axios.create({
  baseURL:
    "https://camp-backend-gqf6ahdgcsgjdgb5.southindia-01.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token to headers
api_url.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token"); // Adjust based on your auth implementation
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized access and convert keys
api_url.interceptors.response.use(
  (response) => {
    if (response.data) {
      // Convert snake_case keys to camelCase
      response.data = camelcaseKeys(response.data, { deep: true });
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login"; // Redirect to login on unauthorized
    }
    return Promise.reject(error);
  }
);

export default api_url;
