import { api } from "../api/api";
import { USER_API } from "../constants/apiRoutes";

interface UserProfileUpdateData {
  name?: string;
  phone?: string;
  profileImage?: string;
  address?: {
    houseNo?: string;
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
}

interface UserPropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  facilities?: string[];
}

export const userService = {
  getUserProfile: async () => {
   
    const response = await api.get(USER_API.PROFILE);
    return response.data;
  },

  updateUserProfile: async (profileData: UserProfileUpdateData) => {
    const response = await api.put(USER_API.PROFILE, profileData);
    return response.data;
  },

  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await api.post(USER_API.UPLOAD_PROFILE_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getActiveProperties: async (params: UserPropertyFilters = {}) => {
    const queryParams = {
      ...params,
      facilities: params.facilities?.join(",") || undefined,
    };
    const response = await api.get(USER_API.PROPERTIES, { params: queryParams });
    return response.data;
  },

  getActivePropertyById: async (propertyId: string) => {
    const response = await api.get(USER_API.PROPERTY_BY_ID(propertyId));
    return response.data;
  },

  checkAvailability: async (
    propertyId: string,
    checkIn: string,
    //checkOut:string,
    rentalPeriod: number,
    guests: number
  ) => {
    const response = await api.get(
      // `/user/properties/${propertyId}/check-availability`,
      USER_API.CHECK_AVAILABILITY(propertyId),
      { params: { checkIn, rentalPeriod, guests } }
    );
    return response.data;
  },
 
  getBlockedDates: async (propertyId: string) => {
  // const response = await api.get(`/user/properties/${propertyId}/blocked-dates`);
  const response = await api.get(USER_API.BLOCKED_DATES(propertyId));
  return response.data;
},

getDestinations: async (params?: { search?: string; page?: number; limit?: number }) => {
  const response = await api.get("/user/destinations",{ params }); 
  return response.data; 
},


};
