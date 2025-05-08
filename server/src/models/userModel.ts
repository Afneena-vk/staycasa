import mongoose, { Document, Schema, ObjectId } from 'mongoose';

// Define interface for address
interface Address {
    houseNo: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  }

// Define interface for User document
export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  profileImage?: string;
  bookings?: ObjectId;
  status: 'active' | 'blocked';
  isVerified: boolean;
  otp?: string;
  googleId?: string;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<Address>(
    {
      houseNo: { type: String, default: '' },
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      district: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    { _id: false } // prevents creating a separate _id for address
  );

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    name: {type: String,required: true,trim: true},
    email: {type: String,required: true,unique: true,trim: true},
    password: {type: String,required: function (this: { googleId?: string }) {return !this.googleId;}},
    phone: {type: String,trim: true,default: null},
    profileImage: {type: String,default: null},
    bookings: {type: Schema.Types.ObjectId,ref: 'Bookings',default: null},
    status: {type: String,enum: ['active', 'blocked'],default: 'active'},
    isVerified: {type: Boolean,default: false},
    otp: {type: String,default: null},
    googleId: {type: String,default: null},
    address: {
        type: addressSchema,
        default: () => ({
          houseNo: '',
          street: '',
          city: '',
          district: '',
          state: '',
          pincode: '',
        }),
      },
  },
  {
    timestamps: true
  }
);

// Create and export the model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
