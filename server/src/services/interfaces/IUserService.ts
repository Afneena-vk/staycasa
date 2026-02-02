

import { UserLoginResponseDto,UserGoogleAuthResponseDto, UserProfileResponseDto, UserProfileUpdateDto, ChangePasswordResponseDto } from "../../dtos/user.dto";
import { ITransaction } from "../../models/walletModel";

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
    //updateUserProfileImage(userId: string, imageUrl: string): Promise<UserProfileResponseDto>;
    updateUserProfileImage(userId: string, fileData: { url: string; publicId: string }): Promise<UserProfileResponseDto>
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
  