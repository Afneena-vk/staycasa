import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "../services/authService";
import { tokenService } from "../utils/tokenService";

type AuthType = "user" | "owner" | "admin";


interface BaseAuthState {
  userData: any | null;
  authType: AuthType | null;
  isAuthenticated: boolean;
  tempEmail: string | null;
}

interface LoginActions {
  login(email: string, password: string, authType: AuthType): Promise<void>;
  logout(): void;
}

interface SignupActions {
  signup(userData: any, authType: Exclude<AuthType, "admin">): Promise<void>;
}

interface OtpActions {
  verifyOTP(email: string, otp: string, authType: AuthType): Promise<void>;
  resendOTP(email: string, authType: AuthType): Promise<void>;
}

interface PasswordResetActions {
  forgotPassword(email: string, authType: Exclude<AuthType, "admin">): Promise<void>;
  resetPassword(
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string,
    authType: Exclude<AuthType, "admin">
  ): Promise<void>;
}


interface MiscAuthActions {
  setTempEmail(email: string | null): void;
  setUser(user: any, authType: AuthType): void;
}


type AuthState = BaseAuthState &
  LoginActions &
  SignupActions &
  OtpActions &
  PasswordResetActions &
  MiscAuthActions;

export const useAuthStore = create<AuthState>()(
    persist(
      (set, get) => ({
        userData: null,
        authType: sessionStorage.getItem("auth-type") as AuthType | null,
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


            ['user', 'owner', 'admin'].forEach(type => {
            if (type !== authType) {
             tokenService.clearTokens(type as AuthType);
             }
             });
                  
       
          console.log("Tokens:", response.accessToken, response.refreshToken);
            tokenService.setAccessToken(response.accessToken, authType);
            tokenService.setRefreshToken(response.refreshToken, authType);
            
            sessionStorage.setItem("auth-type", authType);
            
            set({ 
              userData: response.user  || response.owner || response.admin, 
              authType, 
              isAuthenticated: true 
            });
            
            return response;
          } catch (error) {
            console.error("Login failed", error);
            throw error;
          }
        },

  //       logout: () => {
          
  //        // tokenService.clearTokens();

  //         //   const authType = get().authType;
  //         //     if (authType) {
  //         //     tokenService.clearTokens(authType);
  //         // }
  //        const currentAuthType = get().authType;
  
  // // Clear tokens for current auth type
  //           if (currentAuthType) {
  //          tokenService.clearTokens(currentAuthType);
  //           }

  //           ['user', 'owner', 'admin'].forEach(authType => {
  //           tokenService.clearTokens(authType as AuthType);
  //           });

  //         sessionStorage.removeItem("auth-type");
  //         set({ user: null, authType: null, isAuthenticated: false });
          
          
  //         // authService.logout();
  //       },

         logout: () => {
  // Clear all tokens to prevent cross-contamination
         tokenService.clearAllTokens();
  
         sessionStorage.removeItem("auth-type");
         set({ userData: null, authType: null, isAuthenticated: false, tempEmail: null });
          },
      signup: async (userData, authType) => {
        try {
          let response;
          switch (authType) {
            case "user":
              console.log(userData,"from authstore")
              response = await authService.userSignup(userData);
              break;
            case "owner":
                console.log(userData,"from authstore")
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
    throw new Error("Invalid resend OTP type ");
         }
          const response = await authService.resendOTP(email, authType);
          return response;
        } catch (error) {
          console.error("OTP resend failed", error);
          throw error;
        }
      },
      
      setTempEmail: (email) => {
        set({ tempEmail: email });
      },

         forgotPassword: async (email: string, authType: Exclude<AuthType, "admin">) => {
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

      resetPassword: async (email: string, otp: string, newPassword: string, confirmPassword: string, authType: Exclude<AuthType, "admin">) => {
        try {
          let response;
          switch (authType) {
            case "user":
              response = await authService.userResetPassword(email, otp, newPassword, confirmPassword);
              break;
            case "owner":
              response = await authService.ownerResetPassword(email, otp, newPassword, confirmPassword);
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
    
       setUser: (userData: any, authType: AuthType) => {
        sessionStorage.setItem("auth-type", authType);
        set({ 
          userData, 
          authType, 
          isAuthenticated: true 
        });
      },

    }),
      {
        name: 'auth-storage',
        //getStorage: () => sessionStorage, 
         storage: createJSONStorage(() => localStorage)
      }
    ))

 