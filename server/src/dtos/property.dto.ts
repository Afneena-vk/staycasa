import { FurnishingType } from "../models/propertyModel";
import { PropertyStatus } from "../models/status/status";

export interface CreatePropertyDto {
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
  furnishing:  FurnishingType;
  pricePerMonth: number;
  maxGuests: number;
  minLeasePeriod: number;
  maxLeasePeriod: number;
  features: string[];
  images: string[];
}

export interface OwnerInfoDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessAddress: string;
}

export interface PropertyResponseDto {
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
  pricePerMonth: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  maxGuests: number;
  minLeasePeriod: number;
  maxLeasePeriod: number;
  features: string[];
  images: string[];
  status: PropertyStatus;
  createdAt: Date;
  owner?: OwnerInfoDto;
  averageRating: number;
  totalReviews: number;
}

export interface CreatePropertyResponseDto {
  message: string;
  status: number;
  property: PropertyResponseDto;
}

export interface UpdatePropertyDto {
  title?: string;
  type?: string;
  description?: string;
  houseNumber?: string;
  street?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: FurnishingType;
  pricePerMonth?: number;
  maxGuests?: number;
  minLeasePeriod?: number;
  maxLeasePeriod?: number;
  features?: string[];
  images?: string[];
}

export interface UpdatePropertyResponseDto {
  message: string;
  status: number;
  property: PropertyResponseDto;
}


export interface AdminPropertyListResponseDto {
  message: string;
  status: number;
  properties: PropertyResponseDto[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface OwnerPropertyListResponseDto {
  message: string;
  status: number;
  properties: PropertyResponseDto[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface UserPropertyListResponseDto {
  message: string;
  status: number;
  properties: PropertyResponseDto[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}


export interface AdminPropertyActionResponseDto {
  message: string;
  status: number;
  property: PropertyResponseDto;
}

export interface CheckAvailabilityRequestDTO {
  propertyId: string;
  checkIn: string;
  rentalPeriod: number;
  guests: number;
}

export interface CheckAvailabilityResponseDTO {
  available: boolean;
  message: string;
}

export interface OwnerPropertyStatsDto {
  active: number;
  pending: number;
  blocked: number;
  rejected: number;
}

export interface OwnerPropertyStatsDto {
  active: number;
  pending: number;
  blocked: number;
  rejected: number;
}

