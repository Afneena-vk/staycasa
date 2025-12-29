export interface Property {
  id: string;
  title: string;
  type: string;
  description: string;
  houseNumber: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  pricePerMonth: number;
  maxGuests: number;
  minLeasePeriod: number;
  maxLeasePeriod: number;
  features: string[];
  images: string[];
  
  status: "pending" | "active" | "rejected" |"blocked"|"booked";
  createdAt: Date;

  owner?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    businessName?: string;
    businessAddress?: string;
  };
}

export interface PropertyFormData {
  title: string;
  type: string;
  description: string;
  houseNumber: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  pricePerMonth: number;
  maxGuests: number;
  minLeasePeriod: number;
  maxLeasePeriod: number;
  //amenities: string[];
    features: string[];
  images: File[];
}