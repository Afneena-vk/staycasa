
import { api } from "../api/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "blocked";
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export const authService = {
 
  userSignup: async (userData: any) => {
    const response = await api.post("/user/signup", userData);
    return response.data;
  },

  ownerSignup: async (userData: any) => {
    const response = await api.post("/owner/signup", userData);
    return response.data;
  },

  
  verifyOTP: async (email: string, otp: string, authType: "user" | "owner") => {
    const response = await api.post(`/${authType}/verify-otp`, { email, otp });
    return response.data;
  },

  resendOTP: async (email: string, authType: "user" | "owner") => {
    const response = await api.post(`/${authType}/resend-otp`, { email });
    return response.data;
  },


  userLogin: async (credentials: LoginCredentials) => {
    const response = await api.post("/user/login", credentials);
    return response.data;
  },

  ownerLogin: async (credentials: LoginCredentials) => {
    const response = await api.post("/owner/login", credentials);
    return response.data;
  },

  adminLogin: async (credentials: LoginCredentials) => {
    const response = await api.post("/admin/login", credentials);
    return response.data;
  },

 
  userForgotPassword: async (email: string) => {
    const response = await api.post("/user/forgot-password", { email });
    return response.data;
  },

  ownerForgotPassword: async (email: string) => {
    const response = await api.post("/owner/forgot-password", { email });
    return response.data;
  },

  
  userResetPassword: async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const response = await api.post("/user/reset-password", {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  ownerResetPassword: async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const response = await api.post("/owner/reset-password", {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

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



   blockUser: async (userId: string) => { // Changed parameter type
    const response = await api.patch(`/admin/users/${userId}/block`);
    return response.data;
  },


unblockUser: async (userId: string) => { // Changed parameter type
    const response = await api.patch(`/admin/users/${userId}/unblock`);
    return response.data;
  },


 
 getUserDetails: async (userId: string) => { // Changed parameter type
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


   blockOwner: async (ownerId: string) => { // Changed parameter type
    const response = await api.patch(`/admin/owners/${ownerId}/block`);
    return response.data;
  },


   unblockOwner: async (ownerId: string) => { // Changed parameter type
    const response = await api.patch(`/admin/owners/${ownerId}/unblock`);
    return response.data;
  },

   getOwnerDetails: async (ownerId: string) => { // Changed parameter type
    const response = await api.get(`/admin/owners/${ownerId}`);
    return response.data;
  },

};
