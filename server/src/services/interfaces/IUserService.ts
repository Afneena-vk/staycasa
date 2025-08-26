

import { UserLoginResponseDto,UserGoogleAuthResponseDto, UserProfileResponseDto, UserProfileUpdateDto } from "../../dtos/user.dto";

export interface SignupData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }

  export interface LoginData {
    email: string;
    password: string;
  }
  
  
  export interface IUserService {
    registerUser(data: SignupData): Promise<{ message: string; status: number }>;
    verifyOtp(email: string, otp: string): Promise<{ message: string; status: number }>;
    resendOtp(email: string): Promise<{ message: string; status: number }>;
    loginUser(data: LoginData): Promise<UserLoginResponseDto>;
    processGoogleAuth(profile: any): Promise<UserGoogleAuthResponseDto>;
    forgotPassword(email: string): Promise<{ message: string; status: number }>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<{ message: string; status: number }>;
    getUserProfile(userId: string): Promise<UserProfileResponseDto>;
    updateUserProfile(userId: string, data: UserProfileUpdateDto): Promise<UserProfileResponseDto>;
  }
  