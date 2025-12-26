import { api } from "../api/api";

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
    const response = await api.get("/user/profile");
    return response.data;
  },

  updateUserProfile: async (profileData: UserProfileUpdateData) => {
    const response = await api.put("/user/profile", profileData);
    return response.data;
  },

  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await api.post("/user/profile/upload-image", formData, {
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
    const response = await api.get(`/user/properties`, { params: queryParams });
    return response.data;
  },

  getActivePropertyById: async (propertyId: string) => {
    const response = await api.get(`/user/properties/${propertyId}`);
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
      `/user/properties/${propertyId}/check-availability`,
      { params: { checkIn, rentalPeriod, guests } }
    );
    return response.data;
  },
};
