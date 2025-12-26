import { api } from "../api/api";

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
    const url = queryString ? `/admin/users?${queryString}` : "/admin/users";

    //const response = await api.get(`/admin/users?${queryParams.toString()}`);
    const response = await api.get(url);
    return response.data;
  },

  blockUser: async (userId: string) => {
    const response = await api.patch(`/admin/users/${userId}/block`);
    return response.data;
  },

  unblockUser: async (userId: string) => {
    const response = await api.patch(`/admin/users/${userId}/unblock`);
    return response.data;
  },

  getUserDetails: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`);
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
    const url = queryString ? `/admin/owners?${queryString}` : "/admin/owners";

    //const response = await api.get(`/admin/owners?${queryParams.toString()}`);
    const response = await api.get(url);
    return response.data;
  },

  blockOwner: async (ownerId: string) => {
    const response = await api.patch(`/admin/owners/${ownerId}/block`);
    return response.data;
  },

  unblockOwner: async (ownerId: string) => {
    const response = await api.patch(`/admin/owners/${ownerId}/unblock`);
    return response.data;
  },

  getOwnerDetails: async (ownerId: string) => {
    const response = await api.get(`/admin/owners/${ownerId}`);
    return response.data;
  },

  approveOwner: async (ownerId: string) => {
    const response = await api.patch(`/admin/owners/${ownerId}/approve`, {
      status: "approved",
    });
    return response.data;
  },

  rejectOwner: async (ownerId: string) => {
    const response = await api.patch(`/admin/owners/${ownerId}/reject`, {
      status: "rejected",
    });
    return response.data;
  },

  // getAllPropertiesAdmin:async()=>{
  //   const response = await api.get("/admin/properties");
  //   return response.data;
  // },

  getAllPropertiesAdmin: async (params: PropertyFilters = {}) => {
    const response = await api.get("/admin/properties", { params });
    return response.data;
  },

  getPropertyByAdmin: async (propertyId: string) => {
    const response = await api.get(`/admin/properties/${propertyId}`);
    return response.data;
  },

  approveProperty: async (propertyId: string) => {
    const response = await api.patch(`/admin/properties/${propertyId}/approve`);
    return response.data;
  },

  rejectProperty: async (propertyId: string) => {
    const response = await api.patch(`/admin/properties/${propertyId}/reject`);
    return response.data;
  },

  blockPropertyByAdmin: async (propertyId: string) => {
    const response = await api.patch(`/admin/properties/${propertyId}/block`);
    return response.data;
  },

  unblockPropertyByAdmin: async (propertyId: string) => {
    const response = await api.patch(`/admin/properties/${propertyId}/unblock`);
    return response.data;
  },
};
