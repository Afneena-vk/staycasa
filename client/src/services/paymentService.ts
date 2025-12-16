import { api } from "../api/api";
import BookingDetails from "../pages/user/BookingDetails";

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

export const paymentService={
     calculateTotal: async (propertyId: string, rentalPeriod: number) => {
      const res = await api.post("user/payment/calculate-total", {
      propertyId,
      rentalPeriod,
    });
    return res.data;
  }, 

     createRazorpayOrder: async (
        propertyId: string,
    rentalPeriod: number,
    guests: number,
    moveInDate: string
     )=>{
         const res = await api.post("user/payment/razorpay-order", {
      propertyId,
      rentalPeriod,
      guests,
      moveInDate,
    });
    return res.data;
     },

//  verifyPayment: async (paymentResponse: { razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string }) => {
verifyPayment: async (paymentResponse: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;

  propertyId: string;
  moveInDate: string;
  rentalPeriod: number;
  guests: number;
}) => {
    const res = await api.post("user/payment/verify", paymentResponse);
    return res.data;
  },


fetchUserBookings : async (query: BookingQuery) => {
  const res = await api.post("/user/bookings", query);
  return res.data; 
},

fetchBookingDetails: async(bookingId:string)=>{
  const res = await api.get(`/user/bookings/${bookingId}`);
  return res.data;
}

  
}