import mongoose, { Document, Schema, ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';


export interface IAdmin extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}


const adminSchema = new Schema<IAdmin>(
  {
    name: {type: String, required: true,trim: true},
    email: {type: String,required: true, unique: true,trim: true},
    password: {type: String,required: true}
},
  { timestamps: true}
);

adminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.pre<IAdmin>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
export default Admin;
