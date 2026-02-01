

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthSlice, createAuthSlice } from "./slices/authSlice";
import { AdminSlice, createAdminSlice } from "./slices/adminSlice";
import { OwnerSlice, createOwnerSlice } from "./slices/ownerSlice";
import { UserSlice, createUserSlice } from "./slices/userSlice";
import { PropertySlice, createPropertySlice } from "./slices/propertySlice";
import { BookingState, createBookingSlice } from "./slices/bookingSlice";
import { ReviewSlice,createReviewSlice } from "./slices/reviewSlice";
import { NotificationSlice, createNotificationSlice } from "./slices/notificationSlice";

type StoreState = AuthSlice & AdminSlice & OwnerSlice & UserSlice & PropertySlice &   BookingState & ReviewSlice & NotificationSlice;

export const useAuthStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createAdminSlice(...args),
      ...createOwnerSlice(...args),
      ...createUserSlice(...args),
      ...createPropertySlice(...args),
      ...createBookingSlice(...args), 
      ...createReviewSlice(...args),
      ...createNotificationSlice(...args),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
        
        userData: state.userData,
        authType: state.authType,
        isAuthenticated: state.isAuthenticated,
       
        bookingData: state.bookingData,
        properties: [], 
        isLoading: false,
        error: null, 
        tempEmail: null, 
      }),
    }
  )
);



//export type { AuthType } from "./slices/authSlice";
//export type { OwnerProfile, ProfileResponse } from "./slices/ownerSlice";
//export type { UserProfile, UserProfileResponse } from "./slices/userSlice";
export type {PropertySlice} from './slices/propertySlice'