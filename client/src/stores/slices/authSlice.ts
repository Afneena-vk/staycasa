import { StateCreator } from "zustand";
import { authService } from "../../services/authService";
import { tokenService } from "../../utils/tokenService";

export type AuthType = "user" | "owner" | "admin";

export interface AuthSlice {
  userData: any | null;
  authType: AuthType | null;
  isAuthenticated: boolean;
  tempEmail: string | null;
  
  
  login(email: string, password: string, authType: AuthType): Promise<void>;
  logout(): void;
  signup(userData: any, authType: Exclude<AuthType, "admin">): Promise<void>;
  verifyOTP(email: string, otp: string, authType: AuthType): Promise<void>;
  resendOTP(email: string, authType: AuthType): Promise<void>;
  forgotPassword(email: string, authType: Exclude<AuthType, "admin">): Promise<void>;
  resetPassword(
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string,
    authType: Exclude<AuthType, "admin">
  ): Promise<void>;
  setTempEmail(email: string | null): void;
  setUser(user: any, authType: AuthType): void;
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [],
  [],
  AuthSlice
> = (set, get) => ({
  userData: null,
  authType: (sessionStorage.getItem("auth-type") as AuthType) || null,
  isAuthenticated: false,
  tempEmail: null,

  login: async (email, password, authType) => {
    try {
      let response;
      switch (authType) {
        case "user":
          response = await authService.userLogin({ email, password });
          break;
        case "owner":
          response = await authService.ownerLogin({ email, password });
          break;
        case "admin":
          response = await authService.adminLogin({ email, password });
          break;
        default:
          throw new Error("Invalid login type");
      }

      // Clear other auth types
    //   ["user", "owner", "admin"].forEach((type) => {
    //     if (type !== authType) {
    //       tokenService.clearTokens(type as AuthType);
    //     }
    //   });

      // tokenService.setAccessToken(response.accessToken, authType);
      // tokenService.setRefreshToken(response.refreshToken, authType);
      // sessionStorage.setItem("auth-type", authType);
       tokenService.setAuthType(authType);

      set({
        userData: response.user || response.owner || response.admin,
        authType,
        isAuthenticated: true,
       
      });
        const store = get() as any;
      if (store.resetProperties) {
        store.resetProperties();
      }

      return response;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  },

  logout: async() => {
    // tokenService.clearAllTokens();
    // sessionStorage.removeItem("auth-type");

    try {
      const authType = tokenService.getAuthType();

    if (authType === "user") {
      await authService.logoutUser();
    } else  if (authType === "owner") {
      await authService.logoutOwner();
    } else  if (authType === "admin") {
      await authService.logoutAdmin();
    }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
         tokenService.clearAuthType();
    
    const store = get() as any;
    if (store.resetProperties) {
      store.resetProperties();
    }

    set({
      userData: null,
      authType: null,
      isAuthenticated: false,
      tempEmail: null,
     
    });
      //window.location.href = "/user/login";
    }

  },

  signup: async (userData, authType) => {
    try {
      let response;
      switch (authType) {
        case "user":
          response = await authService.userSignup(userData);
          break;
        case "owner":
          response = await authService.ownerSignup(userData);
          break;
        default:
          throw new Error("Invalid signup type");
      }

      set({ tempEmail: userData.email });
      return response;
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  },

  verifyOTP: async (email, otp, authType) => {
    try {
      if (authType !== "user" && authType !== "owner") {
        throw new Error("Invalid OTP verification type");
      }
      const response = await authService.verifyOTP(email, otp, authType);
      set({ tempEmail: null });
      return response;
    } catch (error) {
      console.error("OTP verification failed", error);
      throw error;
    }
  },

  resendOTP: async (email, authType) => {
    try {
      if (authType !== "user" && authType !== "owner") {
        throw new Error("Invalid resend OTP type");
      }
      const response = await authService.resendOTP(email, authType);
      return response;
    } catch (error) {
      console.error("OTP resend failed", error);
      throw error;
    }
  },

  forgotPassword: async (email, authType) => {
    try {
      let response;
      switch (authType) {
        case "user":
          response = await authService.userForgotPassword(email);
          break;
        case "owner":
          response = await authService.ownerForgotPassword(email);
          break;
        default:
          throw new Error("Invalid forgot password type");
      }

      set({ tempEmail: email });
      return response;
    } catch (error) {
      console.error("Forgot password failed", error);
      throw error;
    }
  },

  resetPassword: async (email, otp, newPassword, confirmPassword, authType) => {
    try {
      let response;
      switch (authType) {
        case "user":
          response = await authService.userResetPassword(
            email,
            otp,
            newPassword,
            confirmPassword
          );
          break;
        case "owner":
          response = await authService.ownerResetPassword(
            email,
            otp,
            newPassword,
            confirmPassword
          );
          break;
        default:
          throw new Error("Invalid reset password type");
      }

      set({ tempEmail: null });
      return response;
    } catch (error) {
      console.error("Reset password failed", error);
      throw error;
    }
  },

  

  setTempEmail: (email) => {
    set({ tempEmail: email });
  },

  setUser: (userData, authType) => {
    //sessionStorage.setItem("auth-type", authType);
    tokenService.setAuthType(authType);

    const store = get() as any;
    if (store.resetProperties) {
      store.resetProperties();
    }
    set({
      userData,
      authType,
      isAuthenticated: true,
     
    });
  },
});