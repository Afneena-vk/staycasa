import mongoose, { Schema, Document, ObjectId } from "mongoose";
//import { PropertyStatus } from "./status/status";
import { PropertyStatus } from "./status/status";

export type FurnishingType = "Fully-Furnished" | "Semi-Furnished" | "Not Furnished";

export interface IProperty extends Document {
  _id: ObjectId;
  ownerId: ObjectId;
  title: string;
  type: string; // e.g., Apartment, Villa, Cottage, Farmhouse
  description: string;
  category?: ObjectId | null;

  // Location
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

  // Property details
  bedrooms: number;
  bathrooms: number;
  furnishing: FurnishingType;
  availableFrom: Date;
  pricePerMonth: number;

  // Stay details
  maxGuests: number;
  checkInTime?: string;   // e.g., "14:00"
  checkOutTime?: string;  // e.g., "11:00"

  // Media
  images: string[];

  // Lease & rules
  minLeasePeriod: number; // in months
  maxLeasePeriod: number; // in months
  rules: string;
  cancellationPolicy: string;

  // Features / Amenities
  features: string[];      // e.g., ["WiFi", "AC", "Kitchen"]
  otherFeatures?: string[];

  // Review & status
  averageRating: number;
  totalReviews: number;
  isBooked: boolean;

  // Moderation
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
    type: { type: String, required: true, trim: true }, // Villa, Apartment, etc.
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },

    // Location
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

    // Property details
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    furnishing: {
      type: String,
      enum: ["Fully-Furnished", "Semi-Furnished", "Not Furnished"],
      required: true,
    },
    availableFrom: { type: Date, default: Date.now },
    pricePerMonth: { type: Number, required: true },

    // Stay details
    maxGuests: { type: Number, required: true },
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "11:00" },

    // Media
    images: { type: [String], default: [] },

    // Lease & rules
    minLeasePeriod: { type: Number, required: true },
    maxLeasePeriod: { type: Number, required: true },
    rules: { type: String, default: "" },
    cancellationPolicy: { type: String, default: "" },

    // Features
    features: { type: [String], default: [] },
    otherFeatures: { type: [String], default: [] },

    // Review & status
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isBooked: { type: Boolean, default: false },

    // Moderation
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
