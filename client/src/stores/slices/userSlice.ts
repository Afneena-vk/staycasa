import { StateCreator } from "zustand";
import { authService } from "../../services/authService";
import {userService}from "../../services/userService";
import { UserProfile,UserProfileResponse } from "../../types/user";



export interface UserSlice {
  getUserProfile(): Promise<UserProfileResponse>;
  updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfileResponse>;

}

export const createUserSlice: StateCreator<
  // UserSlice & { userData: any },
  UserSlice & { userData: UserProfile | null },
  [],
  [],
  UserSlice
> = (set, get) => ({
  getUserProfile: async () => {
    try {
      const response = await userService.getUserProfile();
      return response;
    } catch (error) {
      console.error("Get user profile failed", error);
      throw error;
    }
  },


  updateUserData: (data: Partial<UserProfile>) => {
  // updateUserData: (data: any) => {
    const currentState = get();
    if (currentState.userData) {
      set({
        userData: { ...currentState.userData, ...data },
      });
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await userService.updateUserProfile(profileData);
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