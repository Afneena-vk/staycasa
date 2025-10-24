


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



api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authType = sessionStorage.getItem("auth-type") as "user" | "owner" | "admin" | null;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      authType
      //  authType &&
      // tokenService.getRefreshToken(authType)
      
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
        // const refreshResponse = await axios.post(
          `${API_URL}/api/auth/refresh-token`,
          {},
       
         //{ refreshToken: tokenService.getRefreshToken(authType) },
          { withCredentials: true }
        );

        // const newAccessToken = refreshResponse.data.accessToken;
       
        // tokenService.setAccessToken(newAccessToken, authType);
        
        // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {

       tokenService.clearAuthType();
        // tokenService.clearTokens(authType);
        //const authType = sessionStorage.getItem("auth-type") || "user";
       // sessionStorage.removeItem("auth-type");
        window.location.href = `/${authType}/login`;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);






