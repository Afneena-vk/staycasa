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
}

export interface CreatePropertyResponseDto {
  message: string;
  status: number;
  property: PropertyResponseDto;
}