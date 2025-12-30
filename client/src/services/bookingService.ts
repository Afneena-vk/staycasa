import { api } from "../api/api";
import { USER_API } from "../constants/apiRoutes";

interface BookingQuery {
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

export const bookingService = {
      fetchUserBookings: async (query: BookingQuery) => {
        const res = await api.post(USER_API.BOOKINGS, query);
        return res.data;
      },
    
      fetchBookingDetails: async (bookingId: string) => {
        const res = await api.get(USER_API.BOOKING_BY_ID(bookingId));
        return res.data;
      },
}