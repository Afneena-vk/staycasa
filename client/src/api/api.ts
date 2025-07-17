// import axios from "axios";

// const API_URL = import.meta.env.VITE_BACKEND_URL;

// export const userApi = axios.create({
//   baseURL: `${API_URL}/api/user`,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// export const ownerApi = axios.create({
//   baseURL: `${API_URL}/api/owner`,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// export const adminApi = axios.create({
//     baseURL: `${API_URL}/api/admin`,
//     headers: {
//       "Content-Type": "application/json",
//     },
//     withCredentials: true,
//   });

// src/api/api.ts


// import axios from "axios";


// const API_URL = import.meta.env.VITE_BACKEND_URL;

// export const api = axios.create({
//   baseURL: `${API_URL}/api`, // shared base for /user, /owner, /admin
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });


import axios from "axios";
import { tokenService } from "../utils/tokenService";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Attach access token in every request
api.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      tokenService.getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_URL}/api/refresh-token`,
          { refreshToken: tokenService.getRefreshToken() },
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        tokenService.setAccessToken(newAccessToken);

        // Attach the new token to the failed request and retry it
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenService.clearTokens();
        const authType = sessionStorage.getItem("auth-type") || "user";
        //window.location.href = "/user/login"; // or redirect based on authType
        window.location.href = `/${authType}/login`;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);






