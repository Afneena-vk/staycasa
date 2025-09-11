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
  amenities: string[];
  images: File[];
}

export interface PropertySlice {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addProperty(propertyData: FormData): Promise<void>;
  getOwnerProperties(): Promise<void>;
  clearError(): void;
  setLoading(loading: boolean): void;
}

export const createPropertySlice: StateCreator<
  PropertySlice,
  [],
  [],
  PropertySlice
> = (set, get) => ({
  properties: [],
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

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
});