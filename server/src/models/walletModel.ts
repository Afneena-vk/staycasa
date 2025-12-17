import mongoose, { Document, Schema, Types } from 'mongoose';
import { IBooking } from './bookingModel';

export type TransactionType = "credit" | "debit";
export type PaymentMethod = "razorpay" | "wallet";

export interface ITransaction {
  _id?: Types.ObjectId;
  type: TransactionType;      
  amount: number;
  description?: string;       
  bookingId?: Types.ObjectId; 
  paymentMethod?: PaymentMethod;
  paymentId?: string;        
  date: Date;
}

export interface IWallet extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;  
  userType: "user" | "owner";         
  balance: number;                 
  transactions: ITransaction[];    
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema: Schema<ITransaction> = new Schema(
  {
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    paymentMethod: { type: String, enum: ["razorpay", "wallet"] },
    paymentId: { type: String },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const walletSchema: Schema<IWallet> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true},
    userType: { type: String, enum: ["user", "owner"], required: true },
    balance: { type: Number, required: true, default: 0 },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);



const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);

export default Wallet;