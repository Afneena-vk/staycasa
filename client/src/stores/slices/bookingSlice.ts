import { StateCreator } from "zustand";

export interface BookingState {
      bookingData: {
    propertyId: string;
    moveInDate: string;
    rentalPeriod: number;
    guests: number;
  } | null;

     setBookingData: (data: BookingState["bookingData"]) => void;
     clearBookingData: () => void;

}

export const createBookingSlice: StateCreator<BookingState> = (set) => ({
  bookingData: null,

  setBookingData: (data) => set({ bookingData: data }),
  clearBookingData: () => set({ bookingData: null }),
});