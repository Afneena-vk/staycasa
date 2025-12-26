import { StateCreator } from "zustand";
import { authService } from "../../services/authService";
import { ownerService } from "../../services/ownerService";

export interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  approvalStatus: "pending" | "approved" | "rejected";
  documents: string[];
}

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  approvalStatus: "pending" | "approved" | "rejected";
  documents: string[];
  status: number;
  message?: string;
  data: OwnerProfile;
}

export interface OwnerSlice {
  getOwnerProfile(): Promise<ProfileResponse>;
  updateOwnerProfile(profileData: Partial<OwnerProfile>): Promise<ProfileResponse>;
  uploadDocument(file: File): Promise<{ message: string; document: string }>;
  updateUserData(userData: Partial<OwnerProfile>): void;
}

export const createOwnerSlice: StateCreator<
  OwnerSlice & { userData: any },
  [],
  [],
  OwnerSlice
> = (set, get) => ({
  getOwnerProfile: async () => {
    try {
      const response: ProfileResponse = await ownerService.getOwnerProfile();
      return response;
    } catch (error) {
      console.error("Get owner profile failed", error);
      throw error;
    }
  },

  updateOwnerProfile: async (profileData) => {
    try {
      const response: ProfileResponse = await ownerService.updateOwnerProfile(profileData);

      const currentState = get();
      if (currentState.userData) {
        set({
          userData: {
            ...currentState.userData,
            ...response.data,
          },
        });
      }

      return response;
    } catch (error) {
      console.error("Update owner profile failed", error);
      throw error;
    }
  },

  uploadDocument: async (file) => {
    try {
      const response = await ownerService.uploadDocument(file);

      
      const updatedProfile = await get().getOwnerProfile();
      if (updatedProfile && updatedProfile.status === 200) {
        get().updateUserData({
          documents: updatedProfile.documents,
          approvalStatus: updatedProfile.approvalStatus,
        });
      }

      return response;
    } catch (error) {
      console.error("Document upload failed", error);
      throw error;
    }
  },

  updateUserData: (userData) => {
    const currentState = get();
    set({
      userData: {
        ...currentState.userData,
        ...userData,
      },
    });
  },
});