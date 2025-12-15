export type FurnishingType = "Fully-Furnished" | "Semi-Furnished" | "Not Furnished";
export type PropertyStatus = "pending" | "active" | "booked" | "blocked" | "rejected";

export interface PropertyDTO {
  id: string;                  
  ownerId: string;             

  title: string;
  type: string;
  description: string;
  category?: string;

  address: string;
  houseNumber: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: number;

  bedrooms: number;
  bathrooms: number;
  furnishing: FurnishingType;
  availableFrom: string;       
  pricePerMonth: number;

  maxGuests: number;
  checkInTime?: string;
  checkOutTime?: string;

  images: string[];
  minLeasePeriod: number;
  maxLeasePeriod: number;
  rules: string;
  cancellationPolicy: string;

  features: string[];
  otherFeatures?: string[];

  averageRating: number;
  totalReviews: number;
  isBooked: boolean;
  isRejected: boolean;
  rejectedReason?: string;
  status: PropertyStatus;

  createdAt: string;
  updatedAt: string;
}
