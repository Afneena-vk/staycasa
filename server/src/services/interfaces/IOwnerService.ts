import { OwnerLoginResponseDto } from "../../dtos/owner.dto";

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
}