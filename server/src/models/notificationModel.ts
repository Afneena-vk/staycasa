import mongoose, { Schema, Document, Types } from "mongoose";

export type RecipientModel = "User" | "Owner" | "Admin";

export interface INotification extends Document {
  _id: Types.ObjectId; 
  recipient: Types.ObjectId;
  recipientModel: RecipientModel;   
  type: string;                     
  title: string;                    
  message: string;                 
  read: boolean;
  relatedId?: Types.ObjectId | null; 
  createdAt: Date;
}

const notificationSchema: Schema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "recipientModel",   
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ["User", "Owner", "Admin"],
    },
    type: {
      type: String,
      required: true,
      enum: ["booking", "property", "approval", "wallet", "system"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: Types.ObjectId,
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
