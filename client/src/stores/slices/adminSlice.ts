import { StateCreator } from "zustand";
import { authService } from "../../services/authService";

interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "blocked";
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface AdminSlice {
  // User management
  getUsers(filters?: UserFilters): Promise<any>;
  blockUser(userId: string): Promise<any>;
  unblockUser(userId: string): Promise<any>;
  getUserDetails(userId: string): Promise<any>;
  
  // Owner management
  getOwners(filters?: UserFilters): Promise<any>;
  blockOwner(ownerId: string): Promise<any>;
  unblockOwner(ownerId: string): Promise<any>;
  getOwnerDetails(ownerId: string): Promise<any>;
  approveOwner(ownerId: string): Promise<any>;
  rejectOwner(ownerId: string): Promise<any>;
}

export const createAdminSlice: StateCreator<
  AdminSlice,
  [],
  [],
  AdminSlice
> = (set, get) => ({
  getUsers: async (filters = {}) => {
    try {
      const response = await authService.getUsers(filters);
      return response;
    } catch (error) {
      console.error("Get users failed", error);
      throw error;
    }
  },

  blockUser: async (userId) => {
    try {
      const response = await authService.blockUser(userId);
      return response;
    } catch (error) {
      console.error("Block user failed", error);
      throw error;
    }
  },

  unblockUser: async (userId) => {
    try {
      const response = await authService.unblockUser(userId);
      return response;
    } catch (error) {
      console.error("Unblock user failed", error);
      throw error;
    }
  },

  getUserDetails: async (userId) => {
    try {
      const response = await authService.getUserDetails(userId);
      return response;
    } catch (error) {
      console.error("Get user details failed", error);
      throw error;
    }
  },

  getOwners: async (filters = {}) => {
    try {
      const response = await authService.getOwners(filters);
      return response;
    } catch (error) {
      console.error("Get owners failed", error);
      throw error;
    }
  },

  blockOwner: async (ownerId) => {
    try {
      const response = await authService.blockOwner(ownerId);
      return response;
    } catch (error) {
      console.error("Block owner failed", error);
      throw error;
    }
  },

  unblockOwner: async (ownerId) => {
    try {
      const response = await authService.unblockOwner(ownerId);
      return response;
    } catch (error) {
      console.error("Unblock owner failed", error);
      throw error;
    }
  },

  getOwnerDetails: async (ownerId) => {
    try {
      const response = await authService.getOwnerDetails(ownerId);
      return response;
    } catch (error) {
      console.error("Get owner details failed", error);
      throw error;
    }
  },

  approveOwner: async (ownerId) => {
    try {
      const response = await authService.approveOwner(ownerId);
      return response;
    } catch (error) {
      console.error("Approve owner failed", error);
      throw error;
    }
  },

  rejectOwner: async (ownerId) => {
    try {
      const response = await authService.rejectOwner(ownerId);
      return response;
    } catch (error) {
      console.error("Reject owner failed", error);
      throw error;
    }
  },
});