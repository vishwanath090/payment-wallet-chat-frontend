// api/client.js
import axios from 'axios';

// Use env variable (Vite) → fallback to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

console.log("🔧 API Base URL in use:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Clear auth data from storage
const clearAuthData = () => {
  sessionStorage.clear();
  localStorage.clear();
  console.log("🔐 Auth cleared");
};

// Get token from storage
const getTokenFromStorage = () => {
  return (
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token")
  );
};

// Response interceptor → auto refresh expired access token
api.interceptors.response.use(
  (res) => {
    console.log(`✅ API success: ${res.status} ${res.config.url}`);
    return res;
  },
  async (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.detail;

    console.log("❌ API error:", status, message);

    if (status === 403 && message === "Not authenticated") {
      try {
        const refreshToken =
          sessionStorage.getItem("refresh_token") ||
          localStorage.getItem("refresh_token");

        if (!refreshToken) throw new Error("No refresh token");

        // Refresh request
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const newToken = refreshRes.data.access_token;
        if (!newToken) throw new Error("No new token from backend");

        // Save token
        sessionStorage.setItem("token", newToken);
        sessionStorage.setItem("access_token", newToken);
        localStorage.setItem("token", newToken);
        localStorage.setItem("access_token", newToken);

        // Retry original request
        err.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(err.config);

      } catch (refreshError) {
        console.log("🔐 Refresh failed → logout");
        clearAuthData();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

const getUserFriendlyErrorMessage = (error) => {
  const status = error.response?.status;
  const detail = error.response?.data?.detail;

  if (!status) return "Network error. Check connection.";

  switch (status) {
    case 400: return detail || "Invalid request.";
    case 401: return "Your session expired. Please login again.";
    case 403: return "Not authorized.";
    case 404: return "Resource not found.";
    case 500: return "Server error. Try again later.";
    default: return detail || "Unexpected error occurred.";
  }
};

export { clearAuthData, getTokenFromStorage, getUserFriendlyErrorMessage };
export default api;
