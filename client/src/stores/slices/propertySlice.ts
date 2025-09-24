import { StateCreator } from "zustand";
import { authService } from "../../services/authService";

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
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
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

  
  addProperty(propertyData: FormData): Promise<void>;
  getOwnerProperties(): Promise<void>;
  getOwnerPropertyById(propertyId: string): Promise<void>;
  updateProperty: (propertyId: string, propertyData: FormData) => Promise<void>;  
  deleteProperty: (propertyId: string) => Promise<void>;
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

  getOwnerProperties: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.getOwnerProperties();
      
      set({
        properties: response.properties || [],
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