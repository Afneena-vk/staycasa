
import mongoose, { Schema, Document, Types } from "mongoose";
import { IOwner } from "./ownerModel";
import { ISubscriptionPlan } from "./subscriptionPlan";

export interface ISubscription extends Document {
  ownerId: mongoose.Types.ObjectId | IOwner;
//   subscriptionPlan: Types.ObjectId | ISubscriptionPlan;
  planId : mongoose.Types.ObjectId | ISubscriptionPlan;
  startDate: Date;
  endDate: Date;
  status: "Active" | "Expired";
  paymentId?: string;
  isUpgrade: boolean;
  upgradedFrom?: Types.ObjectId;
  proratedAmount?: number;
  originalAmount?: number;
  transactionType: "New" | "Renewal" | "Upgrade";
}

const subscriptionSchema: Schema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
    // subscriptionPlan: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Active"
    },
    paymentId: { type: String },
    isUpgrade: { type: Boolean, default: false },
    upgradedFrom: { type: Schema.Types.ObjectId, ref: "Subscription" },
    proratedAmount: { type: Number },
    originalAmount: { type: Number },
    transactionType: {
      type: String,
      enum: ["New", "Renewal", "Upgrade"],
      default: "New"
    }
  },
  { timestamps: true }
);

export default mongoose.model<ISubscription>("Subscription", subscriptionSchema);