

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthSlice, createAuthSlice } from "./slices/authSlice";
import { AdminSlice, createAdminSlice } from "./slices/adminSlice";
import { OwnerSlice, createOwnerSlice } from "./slices/ownerSlice";
import { UserSlice, createUserSlice } from "./slices/userSlice";
import { PropertySlice, createPropertySlice } from "./slices/propertySlice";

type StoreState = AuthSlice & AdminSlice & OwnerSlice & UserSlice & PropertySlice;

export const useAuthStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createAdminSlice(...args),
      ...createOwnerSlice(...args),
      ...createUserSlice(...args),
      ...createPropertySlice(...args),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
        
        userData: state.userData,
        authType: state.authType,
        isAuthenticated: state.isAuthenticated,
       
        properties: [], 
        isLoading: false,
        error: null, 
        tempEmail: null, 
      }),
    }
  )
);

// export type { AuthType, OwnerProfile, UserProfile } from "./slices/authSlice";
// export type { ProfileResponse, UserProfileResponse } from "./slices/ownerSlice"; 

export type { AuthType } from "./slices/authSlice";
export type { OwnerProfile, ProfileResponse } from "./slices/ownerSlice";
export type { UserProfile, UserProfileResponse } from "./slices/userSlice";
export type {PropertySlice,PropertyFormData} from './slices/propertySlice'