import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "../services/authService";

type AuthType = "user" | "owner" | "admin";

interface AuthState {
    user: any | null;
    authType: AuthType | null;
    isAuthenticated: boolean;
    tempEmail: string | null; 
    

     login: (email: string, password: string, authType: AuthType) => Promise<void>;
     logout: () => void;
     signup: (userData: any, authType:  Exclude<AuthType, "admin">) => Promise<void>;
     verifyOTP: (email: string, otp: string, authType: AuthType) => Promise<void>;
     resendOTP: (email: string, authType: AuthType) => Promise<void>;
     setTempEmail: (email: string | null) => void;
  }

export const useAuthStore = create<AuthState>()(
    persist(
      (set, get) => ({
        user: null,
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
            
            
            sessionStorage.setItem("auth-type", authType);
            
            set({ 
              user: response.user, 
              authType, 
              isAuthenticated: true 
            });
            
            return response;
          } catch (error) {
            console.error("Login failed", error);
            throw error;
          }
        },

        logout: () => {
          
          sessionStorage.removeItem("auth-type");
          set({ user: null, authType: null, isAuthenticated: false });
          
          
          // authService.logout();
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
      }
    }),
      {
        name: 'auth-storage',
        //getStorage: () => sessionStorage, // Optional: use sessionStorage instead of localStorage
         storage: createJSONStorage(() => localStorage)
      }
    ))

