export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface BookingDTO {
  id: string;                
  bookingId: string;        

  property: {
    id: string;              
    title: string;
    city: string;
    images: string[];
  };

  moveInDate: string;         
  endDate: string;            
  rentalPeriod: number;
  guests: number;

  rentPerMonth: number;
  totalCost: number;

  paymentMethod: string;
  paymentId?: string;
  paymentStatus: PaymentStatus;

  bookingStatus: BookingStatus;
  isCancelled: boolean;
  cancellationReason?: string;
  refundAmount: number;

  createdAt: string;          
}
