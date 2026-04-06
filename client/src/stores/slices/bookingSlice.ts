import { StateCreator } from "zustand";
import { BookingDTO , BookingDetailsDTO, BookingQuery,OwnerBookingStatisDTo} from "../../types/booking";
import { paymentService } from "../../services/paymentService";
import { bookingService } from "../../services/bookingService";
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

export interface BookingState {
      bookingData: {
    propertyId: string;
    moveInDate: string;
    rentalPeriod: number;
    guests: number;
  } | null;

     setBookingData: (data: BookingState["bookingData"]) => void;
     clearBookingData: () => void;


  bookings: BookingDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  status: string;
  paymentStatus: string;
  startDate?: string;
  endDate?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
   bookingType?: "upcoming" | "past" | "ongoing";

   isLoading: boolean;
  error: string | null;


     selectedBooking: BookingDetailsDTO | null;
     fetchBookingDetails: (bookingId: string) => Promise<void>;
     fetchCancelBooking: (bookingId: string) => Promise<{
       message: string;
       refundAmount?: number;
       bookingId?: string;
    }>;

    fetchOwnerCancelBooking: (bookingId: string) => Promise<void>;


    setFilters: (filters: Partial<BookingState>) => void;
    setBookings: (data: {
    bookings: BookingDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }) => void;


  fetchBookings: (query?: BookingQuery) => Promise<void>;
  fetchOwnerBookings: () => Promise<void>;
  fetchBookingDetailsForOwner: (bookingId: string) => Promise<void>;
  // ownerBookingStats: OwnerBookingStatsDto | null;
  ownerBookingStatis: OwnerBookingStatisDTo | null;

  // fetchOwnerBookingStats: () => Promise<void>;  
  fetchOwnerBookingStatis: () => Promise<void>;  
  //adminTotalBookingsCount: number | null; 
 // fetchAdminTotalBookingsCount: () => Promise<void>;
  fetchAdminBookings: () => Promise<void>;
  fetchBookingDetailsForAdmin: (bookingId: string) => Promise<void>;
  fetchRetryPayment: (bookingId: string) => Promise<any>;

}

export const createBookingSlice: StateCreator<BookingState> = (set,get) => ({
  bookingData: null,
  // ownerBookingStats: null,
  ownerBookingStatis: null,
  //adminTotalBookingsCount: null,


  setBookingData: (data) => set({ bookingData: data }),
  clearBookingData: () => set({ bookingData: null }),

  bookings: [],
  total: 0,
  page: 1,
  limit: 9,
  totalPages: 1,
  search: "",
  status: "",
  paymentStatus: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  bookingType: undefined,

  isLoading: false,
  error: null,

   selectedBooking: null,

  setFilters: (filters) =>
    set((state) => ({
      ...state,
      ...filters,
    })),

     setBookings: (data) =>
    set((state) => ({
      ...state,
      bookings: data.bookings,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    })),

    fetchBookings: async () => {
      const state = get();
    const query: BookingQuery = {
      page: state.page,
      limit: state.limit,
      search: state.search,
      status: state.status,
      paymentStatus: state.paymentStatus,
      startDate: state.startDate,
      endDate: state.endDate,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      bookingType: state.bookingType, 
    };
  set({ isLoading: true, error: null });

  try {
    // const response = await paymentService.fetchUserBookings(params|| {});
     const response = await bookingService.fetchUserBookings(query);
    set({
      bookings: response.bookings || [],
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
      isLoading: false,
      error: null,
    });
  
      } catch (error: unknown) {
      set({
        bookings: [],
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
},

    fetchBookingDetails : async (bookingId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await bookingService. fetchBookingDetails(bookingId);
      set({ selectedBooking: res.booking, isLoading: false });
    
        } catch (error: unknown) {
      set({
        selectedBooking: null,
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

fetchOwnerBookings: async () => {
  const state = get();

  const query: BookingQuery = {
    page: state.page,
    limit: state.limit,
    search: state.search || undefined,
    status: state.status || undefined,
    paymentStatus: state.paymentStatus || undefined,
    startDate: state.startDate,
    endDate: state.endDate,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    bookingType: state.bookingType,
  };

  set({ isLoading: true, error: null });

  try {
    const response = await bookingService.fetchOwnerBookings(query);

    set({
      bookings: response.bookings || [],
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
      isLoading: false,
      error: null,
    });
  
      } catch (error: unknown) {
      set({
        bookings: [],
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
},

    fetchBookingDetailsForOwner : async (bookingId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await bookingService. fetchBookingDetailsForOwner(bookingId);
      set({ selectedBooking: res.booking, isLoading: false });
    
        } catch (error: unknown) {
      set({
        selectedBooking: null,
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },



  // fetchAdminTotalBookingsCount: async () => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const totalBookings = await bookingService.fetchAdminBookingOverview(); 
  //     set({ adminTotalBookingsCount: totalBookings, isLoading: false });
  //   } catch (err: any) {
  //     set({
  //       adminTotalBookingsCount: null,
  //       isLoading: false,
  //       error: err.response?.data?.message || err.message || "Failed to fetch admin bookings",
  //     });
  //   }
  // },

fetchCancelBooking: async (bookingId: string) => {
  set({ isLoading: true, error: null });
  try {
    const res = await bookingService.cancelBooking(bookingId);
  
    const currentBooking = get().selectedBooking;
    if (currentBooking && currentBooking.bookingId === res.bookingId) {
      set({
        selectedBooking: {
          ...currentBooking,
          bookingStatus: "cancelled",
          paymentStatus: "refunded",
          isCancelled: true,
          refundAmount: res.refundAmount,
        },
        isLoading: false,
      });
    }
    return res; 
  
     } catch (error: unknown) {
      const message = getErrorMessage(error);

      set({
        isLoading: false,
        error: message,
      });

      throw new Error(message);
    }
},

fetchOwnerCancelBooking: async (bookingId: string) => {
  set({ isLoading: true, error: null });

  try {
   // const res = await bookingService.ownerCancelBooking(bookingId);

   
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              bookingStatus: "cancelled",
              isCancelled: true,
            }
          : b
      ),
      isLoading: false,
    }));
    
  
      } catch (error: unknown) {
      const message = getErrorMessage(error);

      set({
        isLoading: false,
        error: message,
      });

      throw new Error(message);
    }
},

fetchAdminBookings: async () => {
  const state = get();

  const query: BookingQuery = {
    page: state.page,
    limit: state.limit,
    search: state.search || undefined,
    status: state.status || undefined,
    paymentStatus: state.paymentStatus || undefined,
    startDate: state.startDate,
    endDate: state.endDate,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    bookingType: state.bookingType,
  };

  set({ isLoading: true, error: null });

  try {
    const response = await bookingService.fetchAdminBookings(query);

    set({
      bookings: response.bookings,
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
      isLoading: false,
    });
  
      } catch (error: unknown) {
      set({
        bookings: [],
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
},

fetchBookingDetailsForAdmin: async (bookingId: string) => {
  set({ isLoading: true, error: null });
  try {
    const res = await bookingService.fetchBookingDetailsForAdmin(bookingId);
    set({ selectedBooking: res, isLoading: false }); 
  
      } catch (error: unknown) {
      set({
        selectedBooking: null,
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
},


fetchRetryPayment: async (bookingId: string) => {
  set({ isLoading: true, error: null });
  try {
    const response = await paymentService.retryPayment(bookingId);
    set({ isLoading: false });
    return response; 
  
      } catch (error: unknown) {
      const message = getErrorMessage(error);

      set({
        isLoading: false,
        error: message,
      });

      throw new Error(message);
    }
},

fetchOwnerBookingStatis: async() =>{
  set({ isLoading: true, error: null });
  try {
    const stats = await bookingService.fetchOwnerBookingStatis();
    set({ ownerBookingStatis: stats, isLoading: false });
  
      } catch (error: unknown) {
      set({
        ownerBookingStatis: null,
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
},


});