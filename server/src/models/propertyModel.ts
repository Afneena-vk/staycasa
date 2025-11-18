import mongoose, { Schema, Document, ObjectId } from "mongoose";
//import { PropertyStatus } from "./status/status";
import { PropertyStatus } from "./status/status";
import { IOwner } from "./ownerModel";
export type FurnishingType = "Fully-Furnished" | "Semi-Furnished" | "Not Furnished";

export interface IProperty extends Document {
  
   _id: mongoose.Types.ObjectId;     
  ownerId: mongoose.Types.ObjectId| IOwner;  

  title: string;
  type: string; 
  description: string;
  category?:  mongoose.Types.ObjectId| null;


  mapLocation?: {
    place?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
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
  availableFrom: Date;
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

  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true }, 
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },

  
    mapLocation: {
      place: { type: String },
      coordinates: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
      },
    },
    address: { type: String },
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },

    
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    furnishing: {
      type: String,
      enum: ["Fully-Furnished", "Semi-Furnished", "Not Furnished"],
      required: true,
    },
    availableFrom: { type: Date, default: Date.now },
    pricePerMonth: { type: Number, required: true },

    
    maxGuests: { type: Number, required: true },
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "11:00" },

  
    images: { type: [String], default: [] },

    
    minLeasePeriod: { type: Number, required: true },
    maxLeasePeriod: { type: Number, required: true },
    rules: { type: String, default: "" },
    cancellationPolicy: { type: String, default: "" },

   
    features: { type: [String], default: [] },
    otherFeatures: { type: [String], default: [] },

    
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isBooked: { type: Boolean, default: false },

   
    isRejected: { type: Boolean, default: false },
    rejectedReason: { type: String },
    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      default: PropertyStatus.Pending,
      required: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model<IProperty>("Property", propertySchema);
export default Property;
