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

export interface BookingDetailsDTO {
  id: string;
  bookingId: string;

  moveInDate: Date;
  endDate: Date;
  rentalPeriod: number;
  guests: number;

  rentPerMonth: number;
  totalCost: number;

  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  paymentMethod: string;

  createdAt: Date;

  property: {
    id: string;
    title: string;
    description: string;
    city: string;
    address: string;
    images: string[];
    pricePerMonth: number;
    bedrooms: number;
    bathrooms: number;
    furnishing: string;
    street: string;
    type: string; 
    district: string;
    state: string;
    pincode: number;
    houseNumber: string;
  
  };
}
