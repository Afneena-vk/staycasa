import { StateCreator } from "zustand";
import { BookingDTO , BookingDetailsDTO, BookingQuery, OwnerBookingStatsDto} from "../../types/booking";
import { paymentService } from "../../services/paymentService";
import { bookingService } from "../../services/bookingService";

// export interface BookingQuery {
//   page?: number;
//   limit?: number;
//   search?: string;
//   status?: string;
//   paymentStatus?: string;
//   startDate?: string;
//   endDate?: string;
//   sortBy?: string;
//   sortOrder?: "asc" | "desc";
// }

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
  ownerBookingStats: OwnerBookingStatsDto | null;
  fetchOwnerBookingStats: () => Promise<void>;  
  adminTotalBookingsCount: number | null; 
  fetchAdminTotalBookingsCount: () => Promise<void>;

}

export const createBookingSlice: StateCreator<BookingState> = (set,get) => ({
  bookingData: null,
  ownerBookingStats: null,
  adminTotalBookingsCount: null,

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
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || "Failed to fetch bookings";
    set({
      bookings: [],
      isLoading: false,
      error: errorMessage,
    });
  }
},

    fetchBookingDetails : async (bookingId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await bookingService. fetchBookingDetails(bookingId);
      set({ selectedBooking: res.booking, isLoading: false });
    } catch (error: any) {
      set({ selectedBooking: null, isLoading: false, error: error.response?.data?.error || error.message || "Failed to fetch booking" });
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
  } catch (error: any) {
    set({
      bookings: [],
      isLoading: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch owner bookings",
    });
  }
},

    fetchBookingDetailsForOwner : async (bookingId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await bookingService. fetchBookingDetailsForOwner(bookingId);
      set({ selectedBooking: res.booking, isLoading: false });
    } catch (error: any) {
      set({ selectedBooking: null, isLoading: false, error: error.response?.data?.error || error.message || "Failed to fetch booking" });
    }
  },

   fetchOwnerBookingStats: async() =>{
       set({ isLoading: true, error: null });
       try {
        
          const stats = await bookingService.fetchOwnerBookingStats();
           set({ ownerBookingStats: stats, isLoading: false });
       } catch (err:any) {
        set({
        ownerBookingStats: null,
        isLoading: false,
        error: err.response?.data?.message || err.message || "Failed to fetch stats",
      });
    }
  },

  fetchAdminTotalBookingsCount: async () => {
    set({ isLoading: true, error: null });
    try {
      const totalBookings = await bookingService.fetchAdminBookingOverview(); 
      set({ adminTotalBookingsCount: totalBookings, isLoading: false });
    } catch (err: any) {
      set({
        adminTotalBookingsCount: null,
        isLoading: false,
        error: err.response?.data?.message || err.message || "Failed to fetch admin bookings",
      });
    }
  },

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
  } catch (err: any) {
    set({
      isLoading: false,
      error: err.response?.data?.error || err.message || "Failed to cancel booking",
    });
    throw err;
  }
},

fetchOwnerCancelBooking: async (bookingId: string) => {
  set({ isLoading: true, error: null });

  try {
    const res = await bookingService.ownerCancelBooking(bookingId);

   
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
  } catch (err: any) {
    set({
      isLoading: false,
      error:
        err.response?.data?.error ||
        err.message ||
        "Failed to cancel booking",
    });
    throw err;
  }
},



});