import mongoose, { Document, Schema, ObjectId  } from 'mongoose';



export interface IOwner extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  password: string;
  businessAddress: string;
  businessName: string;
  documents: string[];
  isBlocked: boolean;
  isVerified: boolean;
  otp?: string|null;
  otpExpires?: Date|null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}


const ownerSchema = new Schema<IOwner>(
  {
    name: {type: String,required: true},
    email: {type: String,required: true, unique: true,trim: true},
    phone: {type: String,required: true,trim: true},
    password: {type: String,required: true},
    profileImage: {type: String},
    businessAddress: {type: String,required:true,trim: true},
    businessName: {type: String,required: true,trim: true},
    documents: {type: [String],default: []},
    isBlocked: {type: Boolean, default: false},
    isVerified: {type: Boolean,default: false},
    otp: {type: String,default: null },
    otpExpires: {type: Date}
  },
  {
    timestamps: true 
  }
);



const Owner = mongoose.model<IOwner>('Owner', ownerSchema);
export default Owner;