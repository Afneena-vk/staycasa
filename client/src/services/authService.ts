
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

interface OwnerProfileUpdateData {
  name?: string;
  phone?: string;
  businessName?: string;
  businessAddress?: string;
  //profileImage?: string;
}

interface UserProfileUpdateData {
  name?: string;
  phone?: string;
  // profileImage?: string;
  address?: {
    houseNo?: string;
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
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

getOwnerProfile: async () => {
    const response = await api.get("/owner/profile");
    return response.data;
  },

  updateOwnerProfile: async (profileData: OwnerProfileUpdateData) => {
    const response = await api.put("/owner/profile", profileData);
    return response.data;
  },

  
uploadDocument: async (file: File) => {
  const formData = new FormData();
  
    formData.append('document', file);
  
  
  const response = await api.post('/owner/upload-document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
},

   getUserProfile: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  updateUserProfile: async (profileData: UserProfileUpdateData) => {
    const response = await api.put("/user/profile", profileData);
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
  const response = await api.patch(`/admin/owners/${ownerId}/approve`, { status: "approved" });
  return response.data;
},

rejectOwner: async (ownerId: string) => {
  const response = await api.patch(`/admin/owners/${ownerId}/reject`, { status: "rejected" });
  return response.data;
},

addProperty: async (propertyData: FormData) => {
    const response = await api.post("/owner/properties", propertyData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getOwnerProperties: async () => {
    const response = await api.get("/owner/properties");
    return response.data;
  },

 getOwnerPropertyById: async (propertyId: string) => {
  const response = await api.get(`/owner/properties/${propertyId}`);
  return response.data;
},

updateProperty: async (propertyId: string, propertyData: FormData) => {
   const response = await api.put(`/owner/properties/${propertyId}`, propertyData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
},

// authService.ts
deleteOwnerProperty: async (propertyId: string) => {
  const response = await api.delete(`/owner/properties/${propertyId}`);
  return response.data;
},


};
