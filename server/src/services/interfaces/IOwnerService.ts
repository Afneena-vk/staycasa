import { OwnerLoginResponseDto,OwnerProfileResponseDto, OwnerProfileUpdateDto, ChangePasswordResponseDto } from "../../dtos/owner.dto";
import { ITransaction } from "../../models/walletModel";

export interface OwnerSignupData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    businessName: string;
    businessAddress: string;
  }

  export interface OwnerLoginData {
    email: string;
    password: string;
  }
  
  
  export interface IOwnerService {
  registerOwner(data: OwnerSignupData): Promise<{ message: string , status: number }>;

  verifyOtp(email: string, otp: string): Promise<{ message: string; status: number }>;

  resendOtp(email: string): Promise<{ message: string; status: number }>;

  forgotPassword(email: string): Promise<{ message: string; status: number }>;

  resetPassword(email: string, otp: string, newPassword: string): Promise<{ message: string; status: number }>;

  loginOwner(data: OwnerLoginData): Promise<OwnerLoginResponseDto>;

  getOwnerProfile(ownerId: string): Promise<OwnerProfileResponseDto>;
  
  updateOwnerProfile(ownerId: string, data: OwnerProfileUpdateDto): Promise<OwnerProfileResponseDto>;

  uploadDocument(ownerId: string, files: Express.Multer.File): Promise<{ message: string; status: number; document: string }>;

  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<ChangePasswordResponseDto>;

  //getWallet(ownerId: string): Promise<{ balance: number;transactions: ITransaction[]}>;

  getWallet(ownerId: string, page: number, limit: number): Promise<{
  balance: number;
  transactions: ITransaction[];
  totalTransactions: number;
  page: number;
  limit: number;
  totalPages: number;
}>
}