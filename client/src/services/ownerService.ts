import { api } from "../api/api";
import { OWNER_API } from "../constants/apiRoutes";

interface OwnerProfileUpdateData {
  name?: string;
  phone?: string;
  businessName?: string;
  businessAddress?: string;
  //profileImage?: string;
}

interface PropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const ownerService = {
  getOwnerProfile: async () => {
    const response = await api.get(OWNER_API.PROFILE);
    return response.data;
  },

  updateOwnerProfile: async (profileData: OwnerProfileUpdateData) => {
    const response = await api.put(OWNER_API.PROFILE, profileData);
    return response.data;
  },

  uploadDocument: async (file: File) => {
    const formData = new FormData();

    formData.append("document", file);

    const response = await api.post(OWNER_API.UPLOAD_DOCUMENT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  addProperty: async (propertyData: FormData) => {
    const response = await api.post(OWNER_API.PROPERTIES, propertyData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getOwnerProperties: async (params: PropertyFilters = {}) => {
    const response = await api.get(OWNER_API.PROPERTIES, { params });
    return response.data;
  },

  getOwnerPropertyById: async (propertyId: string) => {
    const response = await api.get(OWNER_API.PROPERTY_BY_ID(propertyId));
    return response.data;
  },

  updateProperty: async (propertyId: string, propertyData: FormData) => {
    const response = await api.put(
      OWNER_API.PROPERTY_BY_ID(propertyId),
      propertyData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteOwnerProperty: async (propertyId: string) => {
    const response = await api.delete(OWNER_API.PROPERTY_BY_ID(propertyId));
    return response.data;
  },

  // getOwnerWallet: async () => {
  //   const response = await api.get(OWNER_API.WALLET);
  //   return response.data;
  // },

getOwnerWallet: async (page = 1, limit = 10) => {
  const response = await api.get(OWNER_API.WALLET, { params: { page, limit } });
  return response.data;
},


   fetchOwnerPropertyStats: async () => {
    const res = await api.get(OWNER_API.PROPERTY_STATIS); 
    return res.data.data; 
  },

};
