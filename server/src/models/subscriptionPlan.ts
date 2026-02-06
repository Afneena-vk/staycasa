import mongoose, { Schema, Document, Types  } from "mongoose";

export interface ISubscriptionPlan extends Document {
  _id:Types.ObjectId
  name: string;
  duration: string; 
  price: number;
  maxProperties: number | null;
  createdAt: Date;  
  updatedAt: Date;  
}

const subscriptionPlanSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    maxProperties: { type: Number, default: null },
  },
  { timestamps: true }
);

const SubscriptionPlan=mongoose.model<ISubscriptionPlan>("SubscriptionPlan", subscriptionPlanSchema)
export default SubscriptionPlan ;