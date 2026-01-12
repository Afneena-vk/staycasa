import { api } from "../api/api";
import { USER_API } from "../constants/apiRoutes";
import BookingDetails from "../pages/user/BookingDetails";


export const paymentService = {
  calculateTotal: async (propertyId: string, rentalPeriod: number) => {
    const res = await api.post(USER_API.CALCULATE_TOTAL, {
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
  ) => {
    const res = await api.post(USER_API.RAZORPAY_ORDER, {
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
    const res = await api.post(USER_API.VERIFY_PAYMENT, paymentResponse);
    return res.data;
  },


  handleFailedPayment: async (paymentData: {
  razorpay_order_id: string;
  propertyId: string;
  moveInDate: string;
  rentalPeriod: number;
  guests: number;
  errorCode?: string;
  errorDescription?: string;
}) => {
  const res = await api.post(USER_API.PAYMENT_FAILED, paymentData);
  return res.data;
},

};
