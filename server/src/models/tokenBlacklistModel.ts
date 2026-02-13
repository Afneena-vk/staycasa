import mongoose, { Document, Schema } from 'mongoose';

export interface ITokenBlacklist extends Document {
  token: string;
  type: 'access' | 'refresh';
  userId: string;
  userType: 'user' | 'owner' | 'admin';
  expiresAt: Date;
  createdAt: Date;
}

const tokenBlacklistSchema = new Schema<ITokenBlacklist>(
  {
    token: { type: String, required: true, unique: true },
    type: { type: String, enum: ['access', 'refresh'], required: true },
    userId: { type: String, required: true },
    userType: { type: String, enum: ['user', 'owner', 'admin'], required: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);


tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TokenBlacklist = mongoose.model<ITokenBlacklist>('TokenBlacklist', tokenBlacklistSchema);
export default TokenBlacklist;