import { StateCreator } from "zustand";
import { userService, UserPropertyFilters } from "../../services/userService";
import {PropertyFormData } from "../../types/property";
import { SiTryitonline } from "react-icons/si";
import { ownerService, PropertyFilters } from "../../services/ownerService";
import { adminService,  } from "../../services/adminService";

import { Property, DestinationDto } from "../../types/property";
import axios from "axios";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};


export interface PropertySlice {
  properties: Property[];
  latestProperties: Property[];
  isLoading: boolean;
  error: string | null;
  selectedProperty: Property | null; 
  destinations:DestinationDto[]; 

  totalPages: number;
  totalCount: number;
  currentPage: number;

  ownerPropertyStats: { pending: number; active: number; blocked: number; rejected: number } | null;
  fetchOwnerPropertyStats: () => Promise<void>;
  
  addProperty(propertyData: FormData): Promise<void>;
  getOwnerProperties(params?: PropertyFilters): Promise<void>;
  getOwnerPropertyById(propertyId: string): Promise<void>;
  updateProperty: (propertyId: string, propertyData: FormData) => Promise<void>;  
  deleteProperty: (propertyId: string) => Promise<void>;
  getAllPropertiesAdmin(params?: PropertyFilters): Promise<void>;
  getActivePropertiesForUser(params?: UserPropertyFilters): Promise<void>;
  getActivePropertyById(propertyId:string):Promise<void>;
  getPropertyByAdmin(propertyId:string): Promise<void>;
  approveProperty(propertyId:string): Promise<void>;
  rejectProperty(propertyId:string): Promise<void>;
  blockPropertyByAdmin(propertyId:string): Promise<void>;
  unblockPropertyByAdmin(propertyId:string): Promise<void>;
  getDestinations(params?: { search?: string; page?: number; limit?: number }): Promise<void>;
  fetchLatestActiveProperties: (limit?: number) => Promise<void>;

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
  latestProperties: [],
  selectedProperty: null,
  destinations: [],
  isLoading: false,
  error: null,

  totalPages: 1,
  totalCount: 0,
  currentPage: 1,

  ownerPropertyStats: null,

  addProperty: async (propertyData: FormData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await ownerService.addProperty(propertyData);
      
      if (response.status === 201) {
        
        const newProperty = response.property;
        set((state) => ({
          properties: [...state.properties, newProperty],
          isLoading: false,
          error: null,
        }));
      }

  } catch (error: unknown) {
  const errorMessage = getErrorMessage(error);
  set({ isLoading: false, error: errorMessage });
  throw new Error(errorMessage);
}
  },

  getOwnerProperties: async (params) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await ownerService.getOwnerProperties(params);
      
      set({
        properties: response.properties || [],
        totalCount: response.totalCount || 0,
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
        isLoading: false,
        error: null,
      });

    } catch (error: unknown) {
      set({
        properties: [],
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

    getOwnerPropertyById: async (propertyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ownerService.getOwnerPropertyById(propertyId);
      set({
        selectedProperty: response.property,
        isLoading: false,
        error: null,
      });

    } catch (error: unknown) {
      set({
        selectedProperty: null,
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  updateProperty: async (propertyId: string, propertyData: FormData) => {
    set({ isLoading: true, error: null });

  try {
    const response = await ownerService.updateProperty(propertyId, propertyData);

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

    } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    set({ isLoading: false, error: errorMessage });
    throw new Error(errorMessage); 
  }
},

deleteProperty: async (propertyId: string) => {
  set({ isLoading: true, error: null });
  try {
    await ownerService.deleteOwnerProperty(propertyId);
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== propertyId),
      isLoading: false,
      error: null,
    }));

    } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    set({ isLoading: false, error: errorMessage });
    throw new Error(errorMessage); 
  }
},



getActivePropertiesForUser: async (params) => {
  set({ isLoading: true, error: null });

  try {
    const response = await userService.getActiveProperties(params); 
    set({
      properties: response.properties || [],
      totalPages: response.totalPages,
      totalCount: response.totalCount,
      currentPage: response.currentPage,
      isLoading: false,
      error: null,
    });
  
      } catch (error: unknown) {
      set({ isLoading: false, error: getErrorMessage(error) });
    }
},



  getActivePropertyById: async (propertyId:string)=>{
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getActivePropertyById(propertyId);
      set({
      selectedProperty: response.property,
      isLoading: false,
      error: null,
    });
      
  
    } catch (error: unknown) {
      set({ selectedProperty: null, isLoading: false, error: getErrorMessage(error) });
    }

  },


getAllPropertiesAdmin: async (params) =>{
      set({ isLoading: true, error: null });

  try {
    const response = await adminService.getAllPropertiesAdmin(params);
     set({
      properties: response.properties,
      totalCount: response.totalCount,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
      isLoading: false,
      error: null,
    });

      } catch (error: unknown) {
      set({ isLoading: false, error: getErrorMessage(error) });
    }
},


getPropertyByAdmin: async (propertyId:string)=>{
  set({ isLoading: true, error: null });
  try {
    const response = await adminService.getPropertyByAdmin(propertyId);

    set({
      selectedProperty:response.property,
       isLoading: false,
      error: null,
    })
  
    } catch (error: unknown) {
      set({ selectedProperty: null, isLoading: false, error: getErrorMessage(error) });
    }
},

approveProperty: async (propertyId:string)=>{
    // set({ isLoading: true, error: null });
    set({ error: null });
    try {
      const response = await adminService.approveProperty(propertyId);
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

 
      } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    set({ isLoading: false, error: errorMessage });
    throw new Error(errorMessage); 
  }
},

rejectProperty: async (propertyId: string) => {
  //set({ isLoading: true, error: null });
  set({ error: null });

  try {
    const response = await adminService.rejectProperty(propertyId);

  
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
 
    } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    set({ isLoading: false, error: errorMessage });
    throw new Error(errorMessage);
  }
},

blockPropertyByAdmin: async (propertyId: string) => {
  // set({ isLoading: true, error: null });
    set({ error: null });
  try {
    const response = await adminService.blockPropertyByAdmin(propertyId);
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
 
      } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    set({ isLoading: false, error: errorMessage });
    throw new Error(errorMessage);
  }
},

unblockPropertyByAdmin: async (propertyId: string) => {
  //set({ isLoading: true, error: null });
    set({ error: null });
  try {
    const response = await adminService.unblockPropertyByAdmin(propertyId);
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
  
      } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    set({ isLoading: false, error: errorMessage });
    throw new Error(errorMessage);
  }
},

getDestinations: async (params?: { search?: string; page?: number; limit?: number }) => {
  set({ isLoading: true, error: null });
  try {
    const response = await userService.getDestinations(params); 
    
    set({
      properties: [], 
      isLoading: false,
      error: null,
      destinations: response.data, 
      totalPages: response.totalPages,      
      totalCount: response.total,          
      currentPage: response.page,
    });
  
      } catch (error: unknown) {
      set({ isLoading: false, error: getErrorMessage(error) });
    }
},


  fetchOwnerPropertyStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await ownerService.fetchOwnerPropertyStats();
      set({ ownerPropertyStats: stats, isLoading: false });
    
    } catch (error: unknown) {
      set({ isLoading: false, error: getErrorMessage(error) });
    }
  },

    fetchLatestActiveProperties: async (limit= 6) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getLatestActiveProperties(limit);
       set({ latestProperties:  response.properties || [], isLoading: false, error: null });
  
      } catch (error: unknown) {
      set({ latestProperties: [], isLoading: false, error: getErrorMessage(error) });
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