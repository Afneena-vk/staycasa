


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


// api.interceptors.request.use((config) => {
//   const token = tokenService.getAccessToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

api.interceptors.request.use((config) => {
  const authType = sessionStorage.getItem("auth-type") as "user" | "owner" | "admin" | null;

  if (authType) {
    const token = tokenService.getAccessToken(authType);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authType = sessionStorage.getItem("auth-type") as "user" | "owner" | "admin" | null;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
       authType &&
      tokenService.getRefreshToken(authType)
      //tokenService.getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_URL}/api/refresh-token`,
         // { refreshToken: tokenService.getRefreshToken() },
         { refreshToken: tokenService.getRefreshToken(authType) },
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        //tokenService.setAccessToken(newAccessToken);
        tokenService.setAccessToken(newAccessToken, authType);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
       // tokenService.clearTokens();
        tokenService.clearTokens(authType);
        //const authType = sessionStorage.getItem("auth-type") || "user";
        window.location.href = `/${authType}/login`;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);






