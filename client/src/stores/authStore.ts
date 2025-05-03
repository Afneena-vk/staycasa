import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "../services/authService";

type AuthType = "user" | "owner" | "admin";

interface AuthState {
    user: any | null;
    authType: AuthType | null;
    isAuthenticated: boolean;
  
    // login: (email: string, password: string, authType: AuthType) => Promise<void>;
     signup: (userData: any, authType: AuthType) => Promise<void>;
  
  }

export const useAuthStore = create<AuthState>()(
    persist(
      (set, get) => ({
        user: null,
        authType: sessionStorage.getItem("auth-type") as AuthType | null,
        isAuthenticated: false,
      
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

          return response;
        } catch (error) {
          console.error("Signup failed", error);
          throw error;
        }
      },
    }),
      {
        name: 'auth-storage', // Required: name of localStorage key
        // getStorage: () => sessionStorage, // Optional: use sessionStorage instead of localStorage
      }
    ))