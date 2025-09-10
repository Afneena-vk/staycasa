// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import { authService } from "../services/authService";
// import { tokenService } from "../utils/tokenService";

// type AuthType = "user" | "owner" | "admin";


// interface BaseAuthState {
//   userData: any | null;
//   authType: AuthType | null;
//   isAuthenticated: boolean;
//   tempEmail: string | null;
// }

// interface LoginActions {
//   login(email: string, password: string, authType: AuthType): Promise<void>;
//   logout(): void;
// }

// interface SignupActions {
//   signup(userData: any, authType: Exclude<AuthType, "admin">): Promise<void>;
// }

// interface OtpActions {
//   verifyOTP(email: string, otp: string, authType: AuthType): Promise<void>;
//   resendOTP(email: string, authType: AuthType): Promise<void>;
// }



// interface PasswordResetActions {
//   forgotPassword(email: string, authType: Exclude<AuthType, "admin">): Promise<void>;
//   resetPassword(
//     email: string,
//     otp: string,
//     newPassword: string,
//     confirmPassword: string,
//     authType: Exclude<AuthType, "admin">
//   ): Promise<void>;
// }

// export interface OwnerProfile {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   businessName: string;
//   businessAddress: string;
//   //profileImage?: string;
//   approvalStatus: "pending" | "approved" | "rejected"; // 👈 add
//   documents: string[];
// }

// export interface ProfileResponse {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   businessName: string;
//   businessAddress: string;
//   //profileImage?: string; 
//   approvalStatus: "pending" | "approved" | "rejected"; // 👈 add
//   documents: string[]; 
//   status: number;
//   message?: string;
//   data: OwnerProfile;
// }

// interface ProfileActions {
//   getOwnerProfile(): Promise<ProfileResponse>;
//   updateOwnerProfile(profileData: Partial<OwnerProfile>): Promise<ProfileResponse>;
//   updateUserData(userData: Partial<OwnerProfile>): void;
// }

// export interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   // profileImage?: string;
//   address?: {
//     houseNo: string;
//     street: string;
//     city: string;
//     district: string;
//     state: string;
//     pincode: string;
//   };
//   userStatus: "active" | "blocked";
//   isVerified: boolean;
// }

// export interface UserProfileResponse {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   // profileImage?: string;
//   address?: {
//     houseNo: string;
//     street: string;
//     city: string;
//     district: string;
//     state: string;
//     pincode: string;
//   };
//   userStatus: "active" | "blocked";
//   isVerified: boolean;
//   status: number;
//   message: string;
//   data: UserProfile;
// }

// interface UserProfileActions {
//   getUserProfile(): Promise<UserProfileResponse>;
//   updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfileResponse>;
// }

// interface DocumentActions {
//   uploadDocument(file: File): Promise<{ message: string; document: string }>;
// }

// interface OwnerApprovalActions {
//   approveOwner(ownerId: string): Promise<void>;
//   rejectOwner(ownerId: string): Promise<void>;
// }


// // interface ProfileActions {
// //   getOwnerProfile(): Promise<any>;
// //   updateOwnerProfile(profileData: any): Promise<void>;
// //   updateUserData(userData: any): void;
// // }



// interface MiscAuthActions {
//   setTempEmail(email: string | null): void;
//   setUser(user: any, authType: AuthType): void;
// }


// type AuthState = BaseAuthState &
//   LoginActions &
//   SignupActions &
//   OtpActions &
//   PasswordResetActions &
//   ProfileActions &
//   UserProfileActions &
//   DocumentActions & 
//   OwnerApprovalActions& 
//   MiscAuthActions;

// export const useAuthStore = create<AuthState>()(
//     persist(
//       (set, get) => ({
//         userData: null,
//         authType: sessionStorage.getItem("auth-type") as AuthType | null,
//         isAuthenticated: false,
//          tempEmail: null,
      
// login: async (email, password, authType) => {
//           try {
//             let response;
//             switch (authType) {
//               case "user":
//                 response = await authService.userLogin({ email, password });
//                 break;
//               case "owner":
//                 response = await authService.ownerLogin({ email, password });
//                 break;
//               case "admin":
//                 response = await authService.adminLogin({ email, password });
//                 break;
//               default:
//                 throw new Error("Invalid login type");
//             }


//             ['user', 'owner', 'admin'].forEach(type => {
//             if (type !== authType) {
//              tokenService.clearTokens(type as AuthType);
//              }
//              });
                  
       
//           console.log("Tokens:", response.accessToken, response.refreshToken);
//             tokenService.setAccessToken(response.accessToken, authType);
//             tokenService.setRefreshToken(response.refreshToken, authType);
            
//             sessionStorage.setItem("auth-type", authType);
            
//             set({ 
//               userData: response.user  || response.owner || response.admin, 
//               authType, 
//               isAuthenticated: true 
//             });
            
//             return response;
//           } catch (error) {
//             console.error("Login failed", error);
//             throw error;
//           }
//         },

//   //       logout: () => {
          
//   //        // tokenService.clearTokens();

//   //         //   const authType = get().authType;
//   //         //     if (authType) {
//   //         //     tokenService.clearTokens(authType);
//   //         // }
//   //        const currentAuthType = get().authType;
  
//   // // Clear tokens for current auth type
//   //           if (currentAuthType) {
//   //          tokenService.clearTokens(currentAuthType);
//   //           }

//   //           ['user', 'owner', 'admin'].forEach(authType => {
//   //           tokenService.clearTokens(authType as AuthType);
//   //           });

//   //         sessionStorage.removeItem("auth-type");
//   //         set({ user: null, authType: null, isAuthenticated: false });
          
          
//   //         // authService.logout();
//   //       },

//          logout: () => {
  
//          tokenService.clearAllTokens();
  
//          sessionStorage.removeItem("auth-type");
//          set({ userData: null, authType: null, isAuthenticated: false, tempEmail: null });
//           },
//       signup: async (userData, authType) => {
//         try {
//           let response;
//           switch (authType) {
//             case "user":
//               console.log(userData,"from authstore")
//               response = await authService.userSignup(userData);
//               break;
//             case "owner":
//                 console.log(userData,"from authstore")
//               response = await authService.ownerSignup(userData);
//               break;
//             default:
//               throw new Error("Invalid signup type");
//           }

//             set({ tempEmail: userData.email });

//           return response;
//         } catch (error) {
//           console.error("Signup failed", error);
//           throw error;
//         }
//       },
       
//       verifyOTP: async (email, otp, authType) => {
//         try {
//            if (authType !== "user" && authType !== "owner") {
//            throw new Error("Invalid OTP verification type");
//          }
//           const response = await authService.verifyOTP(email, otp, authType);
          
          
//           set({ tempEmail: null });
          
//           return response;
//         } catch (error) {
//           console.error("OTP verification failed", error);
//           throw error;
//         }
//       },

//        resendOTP: async (email, authType) => {
//         try {
//              if (authType !== "user" && authType !== "owner") {
//     throw new Error("Invalid resend OTP type ");
//          }
//           const response = await authService.resendOTP(email, authType);
//           return response;
//         } catch (error) {
//           console.error("OTP resend failed", error);
//           throw error;
//         }
//       },
      
//       setTempEmail: (email) => {
//         set({ tempEmail: email });
//       },

//          forgotPassword: async (email: string, authType: Exclude<AuthType, "admin">) => {
//         try {
//           let response;
//           switch (authType) {
//             case "user":
//               response = await authService.userForgotPassword(email);
//               break;
//             case "owner":
//               response = await authService.ownerForgotPassword(email);
//               break;
//             default:
//               throw new Error("Invalid forgot password type");
//           }
          
//           set({ tempEmail: email });
//           return response;
//         } catch (error) {
//           console.error("Forgot password failed", error);
//           throw error;
//         }
//       },

//       resetPassword: async (email: string, otp: string, newPassword: string, confirmPassword: string, authType: Exclude<AuthType, "admin">) => {
//         try {
//           let response;
//           switch (authType) {
//             case "user":
//               response = await authService.userResetPassword(email, otp, newPassword, confirmPassword);
//               break;
//             case "owner":
//               response = await authService.ownerResetPassword(email, otp, newPassword, confirmPassword);
//               break;
//             default:
//               throw new Error("Invalid reset password type");
//           }
          
//           set({ tempEmail: null });
//           return response;
//         } catch (error) {
//           console.error("Reset password failed", error);
//           throw error;
//         }
//       },


   
//       //  getOwnerProfile: async () => {
//       //   try {
//       //     const response = await authService.getOwnerProfile();
//       //     return response;
//       //   } catch (error) {
//       //     console.error("Get owner profile failed", error);
//       //     throw error;
//       //   }
//       // },
//       getOwnerProfile: async () => {
//   try {
//     const response: ProfileResponse = await authService.getOwnerProfile();
//     return response;
//   } catch (error) {
//     console.error("Get owner profile failed", error);
//     throw error;
//   }
// },

//       // updateOwnerProfile: async (profileData: any) => {
//       //   try {
//       //     const response = await authService.updateOwnerProfile(profileData);
          
//       //     // Update the userData in store with the updated profile
//       //     const currentState = get();
//       //     if (currentState.userData) {
//       //       set({
//       //         userData: {
//       //           ...currentState.userData,
//       //           ...profileData
//       //         }
//       //       });
//       //     }
          
//       //     return response;
//       //   } catch (error) {
//       //     console.error("Update owner profile failed", error);
//       //     throw error;
//       //   }
//       // },

//       updateOwnerProfile: async (profileData: Partial<OwnerProfile>) => {
//   try {
//     const response: ProfileResponse = await authService.updateOwnerProfile(profileData);

//     const currentState = get();
//     if (currentState.userData) {
//       set({
//         userData: {
//           ...currentState.userData,
//           ...response.data, 
//         },
//       });
//     }

//     return response;
//   } catch (error) {
//     console.error("Update owner profile failed", error);
//     throw error;
//   }
// },


// uploadDocument: async (file: File) => {
//   try {
//     const response = await authService.uploadDocument(file);
    
   
//     const updatedProfile = await get().getOwnerProfile();
//     if (updatedProfile && updatedProfile.status === 200) {
//       get().updateUserData({
//         documents: updatedProfile.documents,
//         approvalStatus: updatedProfile.approvalStatus
//       });
//     }
    
//     return response;
//   } catch (error) {
//     console.error("Document upload failed", error);
//     throw error;
//   }
// },

// approveOwner: async (ownerId: string) => {
//   try {
//     const response = await authService.approveOwner(ownerId);
//     return response;
//   } catch (error) {
//     console.error("Approve owner failed", error);
//     throw error;
//   }
// },

// rejectOwner: async (ownerId: string) => {
//   try {
//     const response = await authService.rejectOwner(ownerId);
//     return response;
//   } catch (error) {
//     console.error("Reject owner failed", error);
//     throw error;
//   }
// },


//   getUserProfile: async () => {
//         return await authService.getUserProfile();
//       },

//       updateUserProfile: async (profileData) => {
//         const response = await authService.updateUserProfile(profileData);
//         const currentState = get();
//         if (currentState.userData) {
//           set({
//             userData: { ...currentState.userData, ...response.data },
//           });
//         }
//         return response;
//       },

//       updateUserData: (userData: any) => {
//         const currentState = get();
//         set({
//           userData: {
//             ...currentState.userData,
//             ...userData
//           }
//         });
//       },

    
//        setUser: (userData: any, authType: AuthType) => {
//         sessionStorage.setItem("auth-type", authType);
//         set({ 
//           userData, 
//           authType, 
//           isAuthenticated: true 
//         });
//       },

//     }),
//       {
//         name: 'auth-storage',
//         //getStorage: () => sessionStorage, 
//          storage: createJSONStorage(() => localStorage)
//       }
//     ))

 import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthSlice, createAuthSlice } from "./slices/authSlice";
import { AdminSlice, createAdminSlice } from "./slices/adminSlice";
import { OwnerSlice, createOwnerSlice } from "./slices/ownerSlice";
import { UserSlice, createUserSlice } from "./slices/userSlice";

type StoreState = AuthSlice & AdminSlice & OwnerSlice & UserSlice;

export const useAuthStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createAdminSlice(...args),
      ...createOwnerSlice(...args),
      ...createUserSlice(...args),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// export type { AuthType, OwnerProfile, UserProfile } from "./slices/authSlice";
// export type { ProfileResponse, UserProfileResponse } from "./slices/ownerSlice"; 

export type { AuthType } from "./slices/authSlice";
export type { OwnerProfile, ProfileResponse } from "./slices/ownerSlice";
export type { UserProfile, UserProfileResponse } from "./slices/userSlice";