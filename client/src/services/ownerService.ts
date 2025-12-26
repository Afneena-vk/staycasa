import { api } from "../api/api";

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
    const response = await api.get("/owner/profile");
    return response.data;
  },

  updateOwnerProfile: async (profileData: OwnerProfileUpdateData) => {
    const response = await api.put("/owner/profile", profileData);
    return response.data;
  },

  uploadDocument: async (file: File) => {
    const formData = new FormData();

    formData.append("document", file);

    const response = await api.post("/owner/upload-document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

  getOwnerProperties: async (params: PropertyFilters = {}) => {
    const response = await api.get("/owner/properties", { params });
    return response.data;
  },

  getOwnerPropertyById: async (propertyId: string) => {
    const response = await api.get(`/owner/properties/${propertyId}`);
    return response.data;
  },

  updateProperty: async (propertyId: string, propertyData: FormData) => {
    const response = await api.put(
      `/owner/properties/${propertyId}`,
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
    const response = await api.delete(`/owner/properties/${propertyId}`);
    return response.data;
  },

  getOwnerWallet: async () => {
    const response = await api.get("/owner/wallet");
    return response.data;
  },
};
