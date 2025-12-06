import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  // baseURL is handled by the full URLs in actions
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout for large data queries
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ✓ ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `[API] ✗ ${error.config?.url} - ${error.response.status}`,
        error.response.data
      );
    } else if (error.request) {
      console.error("[API] ✗ No response received:", error.message);
    } else {
      console.error("[API] ✗ Error:", error.message);
    }
    return Promise.reject(error);
  }
);
