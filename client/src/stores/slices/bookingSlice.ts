import { StateCreator } from "zustand";
import { BookingDTO , BookingDetailsDTO} from "../../types/booking";
import { paymentService } from "../../services/paymentService";

export interface BookingQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

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

   isLoading: boolean;
  error: string | null;


     selectedBooking: BookingDetailsDTO | null;
     fetchBookingDetails: (bookingId: string) => Promise<void>;

    setFilters: (filters: Partial<BookingState>) => void;
    setBookings: (data: {
    bookings: BookingDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }) => void;


  fetchBookings: (query?: BookingQuery) => Promise<void>;

}

export const createBookingSlice: StateCreator<BookingState> = (set,get) => ({
  bookingData: null,

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
    };
  set({ isLoading: true, error: null });

  try {
    // const response = await paymentService.fetchUserBookings(params|| {});
     const response = await paymentService.fetchUserBookings(query);
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
      const res = await paymentService. fetchBookingDetails(bookingId);
      set({ selectedBooking: res.booking, isLoading: false });
    } catch (error: any) {
      set({ selectedBooking: null, isLoading: false, error: error.response?.data?.error || error.message || "Failed to fetch booking" });
    }
  },



});