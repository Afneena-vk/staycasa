import { api } from "../api/api";
import { OWNER_API, USER_API, ADMIN_API } from "../constants/apiRoutes";

interface BookingQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  bookingType?: "upcoming" | "past" | "ongoing"
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const bookingService = {
      fetchUserBookings: async (query: BookingQuery) => {
        const res = await api.post(USER_API.BOOKINGS, query);
        return res.data;
      },
    
      fetchBookingDetails: async (bookingId: string) => {
        const res = await api.get(USER_API.BOOKING_BY_ID(bookingId));
        return res.data;
      },
   
     fetchOwnerBookings: async (query: BookingQuery) => {
        // const res = await api.post(OWNER_API.BOOKINGS, query);
      const res = await api.get(OWNER_API.BOOKINGS, {
      params: query,
    });
        return res.data;
      },

      fetchBookingDetailsForOwner: async (bookingId: string) => {
        const res = await api.get(OWNER_API.BOOKING_BY_ID(bookingId));
        return res.data;
      },

      fetchOwnerBookingStats: async () => {
        const res = await api.get(OWNER_API.BOOKING_STATS);
        return res.data.stats;
      },
    
      fetchAdminBookingOverview: async () => {
    const res = await api.get(ADMIN_API.BOOKING_COUNT); 
    return res.data.totalCount; 
  },

    cancelBooking: async (bookingId: string) => {
    const res = await api.post(USER_API.CANCEL_BOOKING(bookingId));
    return res.data.data; 
  },

    ownerCancelBooking: async (bookingId: string) => {
    const res = await api.post(OWNER_API.CANCEL_BOOKING(bookingId));
    return res.data.data; 
  },

}