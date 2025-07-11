

import { ownerApi, userApi, adminApi } from "../api/api";

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {

  userSignup: async (userData: any) => {
    const response = await userApi.post("/signup", userData);
    return response.data;
  },

  ownerSignup: async (userData: any) => {
    const response = await ownerApi.post("/signup", userData);
    return response.data;
  },
   verifyOTP: async (email: string, otp: string, authType: "user" | "owner") => {
    const api = authType === "user" ? userApi : ownerApi;
    const response = await api.post("/verify-otp", { email, otp });
    return response.data;
  },
   resendOTP: async (email: string, authType: "user" | "owner") => {
    const api = authType === "user" ? userApi : ownerApi;
    const response = await api.post("/resend-otp", { email });
    return response.data;
  },
   userLogin: async (credentials: LoginCredentials) => {
    const response = await userApi.post("/login", credentials);
    return response.data;
  },
  
   ownerLogin: async (credentials: LoginCredentials) => {
    const response = await ownerApi.post("/login", credentials);
    return response.data;
  },
  
  
  adminLogin: async (credentials: LoginCredentials) => {
    const response = await adminApi.post("/login", credentials);
    return response.data;
  },

}

