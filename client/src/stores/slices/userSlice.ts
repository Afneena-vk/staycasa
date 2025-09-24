import { StateCreator } from "zustand";
import { authService } from "../../services/authService";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    houseNo: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  userStatus: "active" | "blocked";
  profileImage?: string;
  isVerified: boolean;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    houseNo: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  userStatus: "active" | "blocked";
  isVerified: boolean;
  status: number;
  profileImage?: string;
  message: string;
  data: UserProfile;
}

export interface UserSlice {
  getUserProfile(): Promise<UserProfileResponse>;
  updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfileResponse>;
}

export const createUserSlice: StateCreator<
  UserSlice & { userData: any },
  [],
  [],
  UserSlice
> = (set, get) => ({
  getUserProfile: async () => {
    try {
      const response = await authService.getUserProfile();
      return response;
    } catch (error) {
      console.error("Get user profile failed", error);
      throw error;
    }
  },

  // updateUserData: (data: any) => {
  //   const currentState = get();
  //   if (currentState.userData) {
  //     set({
  //       userData: { ...currentState.userData, ...data },
  //     });
  //   }
  // },

  updateUserProfile: async (profileData) => {
    try {
      const response = await authService.updateUserProfile(profileData);
      const currentState = get();
      if (currentState.userData) {
        set({
          userData: { ...currentState.userData, ...response.data },
        });
      }
      return response;
    } catch (error) {
      console.error("Update user profile failed", error);
      throw error;
    }
  },
});