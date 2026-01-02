import { api } from "../api/api";
import { ADMIN_API } from "../constants/apiRoutes";

interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "blocked";
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}

interface PropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const adminService = {
  getUsers: async (filters: UserFilters = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `${ADMIN_API.USERS}?${queryString}` : ADMIN_API.USERS;

    //const response = await api.get(`/admin/users?${queryParams.toString()}`);
    const response = await api.get(url);
    return response.data;
  },

  blockUser: async (userId: string) => {
    const response = await api.patch(ADMIN_API.BLOCK_USER(userId));
    return response.data;
  },

  unblockUser: async (userId: string) => {
    const response = await api.patch(ADMIN_API.UNBLOCK_USER(userId));
    return response.data;
  },

  getUserDetails: async (userId: string) => {
    const response = await api.get(ADMIN_API.USER_BY_ID(userId));
    return response.data;
  },

  getOwners: async (filters: UserFilters = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `${ADMIN_API.OWNERS}?${queryString}` : ADMIN_API.OWNERS;

    //const response = await api.get(`/admin/owners?${queryParams.toString()}`);
    const response = await api.get(url);
    return response.data;
  },

  blockOwner: async (ownerId: string) => {
    const response = await api.patch(ADMIN_API.BLOCK_OWNER(ownerId));
    return response.data;
  },

  unblockOwner: async (ownerId: string) => {
    const response = await api.patch(ADMIN_API.UNBLOCK_OWNER(ownerId));
    return response.data;
  },

  getOwnerDetails: async (ownerId: string) => {
    const response = await api.get(ADMIN_API.OWNER_BY_ID(ownerId));
    return response.data;
  },

  approveOwner: async (ownerId: string) => {
    const response = await api.patch(ADMIN_API.APPROVE_OWNER(ownerId), {
      status: "approved",
    });
    return response.data;
  },

  rejectOwner: async (ownerId: string) => {
    const response = await api.patch(ADMIN_API.REJECT_OWNER(ownerId), {
      status: "rejected",
    });
    return response.data;
  },

  // getAllPropertiesAdmin:async()=>{
  //   const response = await api.get("/admin/properties");
  //   return response.data;
  // },

  getAllPropertiesAdmin: async (params: PropertyFilters = {}) => {
    const response = await api.get(ADMIN_API.PROPERTIES, { params });
    return response.data;
  },

  getPropertyByAdmin: async (propertyId: string) => {
    const response = await api.get(ADMIN_API.PROPERTY_BY_ID(propertyId));
    return response.data;
  },

  approveProperty: async (propertyId: string) => {
    const response = await api.patch(ADMIN_API.APPROVE_PROPERTY(propertyId));
    return response.data;
  },

  rejectProperty: async (propertyId: string) => {
    const response = await api.patch(ADMIN_API.REJECT_PROPERTY(propertyId));
    return response.data;
  },

  blockPropertyByAdmin: async (propertyId: string) => {
    const response = await api.patch(ADMIN_API.BLOCK_PROPERTY(propertyId));
    return response.data;
  },

  unblockPropertyByAdmin: async (propertyId: string) => {
    const response = await api.patch(ADMIN_API.UNBLOCK_PROPERTY(propertyId));
    return response.data;
  },

  adminUserStatistics: async()=> {
  const response = await api.get(ADMIN_API.USER_STATISTICS);
  return response.data.data;
  }
};
