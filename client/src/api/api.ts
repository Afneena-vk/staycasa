


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
   
      
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
       
          `${API_URL}/api/auth/refresh-token`,
          {},
       
          { withCredentials: true }
        );

  
        return api(originalRequest);
      } catch (refreshError) {

       tokenService.clearAuthType();
    
         if (!window.location.pathname.includes("/login")) {
          window.location.href = `/${authType}/login`;
        }
        return Promise.reject(refreshError);
      }
    }
     
if (error.response?.status === 403) {

      tokenService.clearAuthType();

      if (authType && !window.location.pathname.includes("/login")) {
        window.location.href = `/${authType}/login`;
      }
    }

    return Promise.reject(error);
  }
);










