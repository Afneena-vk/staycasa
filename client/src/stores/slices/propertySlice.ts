import { StateCreator } from "zustand";
import { authService } from "../../services/authService";
import { SiTryitonline } from "react-icons/si";

export interface Property {
  id: string;
  title: string;
  type: string;
  description: string;
  houseNumber: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  pricePerMonth: number;
  maxGuests: number;
  minLeasePeriod: number;
  maxLeasePeriod: number;
  features: string[];
  images: string[];
  // status: "pending" | "approved" | "rejected";
  status: "pending" | "active" | "rejected" |"blocked"|"booked";
  createdAt: Date;

  owner?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    businessName?: string;
    businessAddress?: string;
  };
}

export interface PropertyFormData {
  title: string;
  type: string;
  description: string;
  houseNumber: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  pricePerMonth: number;
  maxGuests: number;
  minLeasePeriod: number;
  maxLeasePeriod: number;
  //amenities: string[];
    features: string[];
  images: File[];
}


export interface PropertySlice {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  selectedProperty: Property | null; 


  totalPages: number;
  totalCount: number;
  currentPage: number;
  
  addProperty(propertyData: FormData): Promise<void>;
  getOwnerProperties(params?:any): Promise<void>;
  getOwnerPropertyById(propertyId: string): Promise<void>;
  updateProperty: (propertyId: string, propertyData: FormData) => Promise<void>;  
  deleteProperty: (propertyId: string) => Promise<void>;
  getAllPropertiesAdmin(params?:any): Promise<void>; 
  getActivePropertiesForUser: () => Promise<void>;
  getPropertyByAdmin(propertyId:string): Promise<void>;
  approveProperty(propertyId:string): Promise<void>;
  rejectProperty(propertyId:string): Promise<void>;
  blockPropertyByAdmin(propertyId:string): Promise<void>;
  unblockPropertyByAdmin(propertyId:string): Promise<void>;
  clearError(): void;
  setLoading(loading: boolean): void;
  resetProperties(): void;
}

export const createPropertySlice: StateCreator<
  PropertySlice,
  [],
  [],
  PropertySlice
> = (set, get) => ({
  properties: [],
   selectedProperty: null,
  isLoading: false,
  error: null,

  totalPages: 1,
  totalCount: 0,
  currentPage: 1,

  addProperty: async (propertyData: FormData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.addProperty(propertyData);
      
      if (response.status === 201) {
        
        const newProperty = response.property;
        set((state) => ({
          properties: [...state.properties, newProperty],
          isLoading: false,
          error: null,
        }));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Failed to add property";
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      throw new Error(errorMessage);
    }
  },

  getOwnerProperties: async (params) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.getOwnerProperties(params);
      
      set({
        properties: response.properties || [],
        totalCount: response.totalCount || 0,
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Failed to fetch properties";
      set({ 
        properties: [],
        isLoading: false, 
        error: errorMessage 
      });
    }
  },

    getOwnerPropertyById: async (propertyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.getOwnerPropertyById(propertyId);
      set({
        selectedProperty: response.property,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to fetch property details";
      set({
        selectedProperty: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  updateProperty: async (propertyId: string, propertyData: FormData) => {
    set({ isLoading: true, error: null });

  try {
    const response = await authService.updateProperty(propertyId, propertyData);

    if (response.status === 200) {
      const updatedProperty = response.property;

      set((state) => ({
        properties: state.properties.map((prop) =>
          prop.id === updatedProperty.id ? updatedProperty : prop
        ),
        selectedProperty: updatedProperty, 
        isLoading: false,
        error: null,
      }));
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Failed to update property";
    set({
      isLoading: false,
      error: errorMessage,
    });
    throw new Error(errorMessage);
  }
},

deleteProperty: async (propertyId: string) => {
  set({ isLoading: true, error: null });
  try {
    await authService.deleteOwnerProperty(propertyId);
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== propertyId),
      isLoading: false,
      error: null,
    }));
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || "Failed to delete property";
    set({ isLoading: false, error: errorMessage });
    throw new Error(errorMessage);
  }
},

// getAllPropertiesAdmin: async () =>{
//   set({ isLoading: true, error: null });
//   try {
//     const response = await authService.getAllPropertiesAdmin();
//       set({
//       properties: response.properties || [],
//       isLoading: false,
//       error: null,
//     });
//   } catch (error:any) {
//     const errorMessage =
//       error.response?.data?.error || error.message || "Failed to fetch all properties";
//     set({ properties: [], isLoading: false, error: errorMessage });
//   }
// },

getActivePropertiesForUser: async () => {
  set({ isLoading: true, error: null });

  try {
    const response = await authService.getActiveProperties(); 
    set({
      properties: response.properties || [],
      isLoading: false,
      error: null,
    });
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || "Failed to fetch active properties";
    set({
      properties: [],
      isLoading: false,
      error: errorMessage,
    });
  }
},



getAllPropertiesAdmin: async (params) =>{
      set({ isLoading: true, error: null });

  try {
    const response = await authService.getAllPropertiesAdmin(params);
     set({
      properties: response.properties,
      totalCount: response.totalCount,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
      isLoading: false,
      error: null,
    });
     } catch (error:any) {
       const errorMessage = error.response?.data?.error || error.message || "Failed";
    set({ isLoading: false, error: error.message });
  }
},


getPropertyByAdmin: async (propertyId:string)=>{
  set({ isLoading: true, error: null });
  try {
    const response = await authService.getPropertyByAdmin(propertyId);

    set({
      selectedProperty:response.property,
       isLoading: false,
      error: null,
    })
  } catch (error: any) {
    const errorMessage =
    error.response?.data?.error || error.message || "Failed to fetch property details";
     set({
      selectedProperty: null,
      isLoading: false,
      error: errorMessage,
    });
  }
},

approveProperty: async (propertyId:string)=>{
    set({ isLoading: true, error: null });
    try {
      const response = await authService.approveProperty(propertyId);
       set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId ? response.property : p
      ),
      selectedProperty:
        state.selectedProperty?.id === propertyId
          ? response.property
          : state.selectedProperty,
      isLoading: false,
      error: null,
    }));

    return response;

    } catch (error: any) {
      const errorMessage =
      error.response?.data?.error || error.message || "Failed to approve property";
    set({ isLoading: false, error: errorMessage });
    throw new Error(errorMessage);
    }
},

rejectProperty: async (propertyId: string) => {
  set({ isLoading: true, error: null });

  try {
    const response = await authService.rejectProperty(propertyId);

  
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId ? response.property : p
      ),
      selectedProperty:
        state.selectedProperty?.id === propertyId
          ? response.property
          : state.selectedProperty,
      isLoading: false,
      error: null,
    }));



    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || "Failed to reject property";
    set({ isLoading: false, error: errorMessage });
    throw new Error(errorMessage);
  }
},

blockPropertyByAdmin: async (propertyId: string) => {
  set({ isLoading: true, error: null });
  try {
    const response = await authService.blockPropertyByAdmin(propertyId);
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId ? response.property : p
      ),
      selectedProperty:
        state.selectedProperty?.id === propertyId
          ? response.property
          : state.selectedProperty,
      isLoading: false,
      error: null,
    }));
    return response; 
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || "Failed to block property";
    set({ isLoading: false, error: errorMessage });
    throw new Error(errorMessage);
  }
},

unblockPropertyByAdmin: async (propertyId: string) => {
  set({ isLoading: true, error: null });
  try {
    const response = await authService.unblockPropertyByAdmin(propertyId);
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId ? response.property : p
      ),
      selectedProperty:
        state.selectedProperty?.id === propertyId
          ? response.property
          : state.selectedProperty,
      isLoading: false,
      error: null,
    }));
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || "Failed to unblock property";
    set({ isLoading: false, error: errorMessage });
     throw new Error(errorMessage);
  }
},





  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  resetProperties: () => {
    set({ 
      properties: [], 
      isLoading: false, 
      error: null 
    });
  },
});