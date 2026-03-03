import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {

  _id: mongoose.Types.ObjectId;   

  sender: mongoose.Types.ObjectId;
  senderModel: "User" | "Owner";

  receiver: mongoose.Types.ObjectId;
  receiverModel: "User" | "Owner";

  propertyId: mongoose.Types.ObjectId;   
  content?: string;                     
  image?: string;                        
  isRead: boolean;                      
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["User", "Owner"],
    },

    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["User", "Owner"],
    },

    
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,   
    },

    
    content: {
      type: String,
      required: function () {
        return !this.image;
      },
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);


messageSchema.index({ sender: 1, receiver: 1, propertyId: 1, createdAt: 1 });

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
