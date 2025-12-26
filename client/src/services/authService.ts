import { api } from "../api/api";
import { AUTH_API } from "../constants/apiRoutes";

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  userSignup: async (userData: any) => {
    // const response = await api.post("/user/signup", userData);
      const response = await api.post( AUTH_API.USER_SIGNUP, userData);
    return response.data;
  },

  ownerSignup: async (userData: any) => {
    // const response = await api.post("/owner/signup", userData);
    const response = await api.post(AUTH_API.OWNER_SIGNUP, userData);
    return response.data;
  },

  verifyOTP: async (email: string, otp: string, authType: "user" | "owner") => {
    // const response = await api.post(`/${authType}/verify-otp`, { email, otp });
     const response = await api.post(AUTH_API.VERIFY_OTP(authType), { email, otp });
    return response.data;
  },

  resendOTP: async (email: string, authType: "user" | "owner") => {
    // const response = await api.post(`/${authType}/resend-otp`, { email });
        const response = await api.post(AUTH_API.RESEND_OTP(authType), { email });
    return response.data;
  },

  userLogin: async (credentials: LoginCredentials) => {
    const response = await api.post(AUTH_API.USER_LOGIN, credentials);
    return response.data;
  },

  ownerLogin: async (credentials: LoginCredentials) => {
    // const response = await api.post("/owner/login", credentials);
        const response = await api.post(AUTH_API.OWNER_LOGIN, credentials);
    return response.data;
  },

  adminLogin: async (credentials: LoginCredentials) => {
    const response = await api.post(AUTH_API.ADMIN_LOGIN, credentials);
    return response.data;
  },

  logoutUser: async () => {
    // const response = await api.post("/user/logout");
    const response = await api.post(AUTH_API.USER_LOGOUT);
    return response.data;
  },
  logoutOwner: async () => {
    const response = await api.post(AUTH_API.OWNER_LOGOUT);
    return response.data;
  },
  logoutAdmin: async () => {
    const response = await api.post(AUTH_API.ADMIN_LOGOUT);
    return response.data;
  },

  userForgotPassword: async (email: string) => {
    const response = await api.post(AUTH_API.USER_FORGOT_PASSWORD, { email });
    return response.data;
  },

  ownerForgotPassword: async (email: string) => {
    const response = await api.post(AUTH_API.OWNER_FORGOT_PASSWORD, { email });
    return response.data;
  },

  userResetPassword: async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const response = await api.post(AUTH_API.USER_RESET_PASSWORD, {
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
    const response = await api.post(AUTH_API.OWNER_RESET_PASSWORD, {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  // changePassword: async (
  //   data: { userId?: string; currentPassword: string; newPassword: string },
  //   type: "user" | "owner"
  // ) => {
  //   let url = "";

  //   switch (type) {
  //     case "user":
  //       url = "/user/change-password";
  //       break;
  //     case "owner":
  //       url = "/owner/change-password";
  //       break;
  //   }

  //   const response = await api.put(url, data);
  //   return response.data;
  // },
  changePassword: async (
  data: { userId?: string; currentPassword: string; newPassword: string },
  type: "user" | "owner"
) => {
  const response = await api.put(
    AUTH_API.CHANGE_PASSWORD(type),
    data
  );
  return response.data;
},
};
