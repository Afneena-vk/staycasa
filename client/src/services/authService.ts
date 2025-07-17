
import { api } from "../api/api";

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
 
  userSignup: async (userData: any) => {
    const response = await api.post("/user/signup", userData);
    return response.data;
  },

  ownerSignup: async (userData: any) => {
    const response = await api.post("/owner/signup", userData);
    return response.data;
  },

  
  verifyOTP: async (email: string, otp: string, authType: "user" | "owner") => {
    const response = await api.post(`/${authType}/verify-otp`, { email, otp });
    return response.data;
  },

  resendOTP: async (email: string, authType: "user" | "owner") => {
    const response = await api.post(`/${authType}/resend-otp`, { email });
    return response.data;
  },


  userLogin: async (credentials: LoginCredentials) => {
    const response = await api.post("/user/login", credentials);
    return response.data;
  },

  ownerLogin: async (credentials: LoginCredentials) => {
    const response = await api.post("/owner/login", credentials);
    return response.data;
  },

  adminLogin: async (credentials: LoginCredentials) => {
    const response = await api.post("/admin/login", credentials);
    return response.data;
  },

 
  userForgotPassword: async (email: string) => {
    const response = await api.post("/user/forgot-password", { email });
    return response.data;
  },

  ownerForgotPassword: async (email: string) => {
    const response = await api.post("/owner/forgot-password", { email });
    return response.data;
  },

  
  userResetPassword: async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const response = await api.post("/user/reset-password", {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  ownerResetPassword: async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const response = await api.post("/owner/reset-password", {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};
