// src/services/interfaces/IUserServices.ts

// import { IUser } from "../../models/userModel";

// export interface IUserService {
//   registerUser(userData: Partial<IUser>): Promise<{ message: string }>;
// }

// Better to define a separate type just for signup

export interface SignupData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface IUserService {
    registerUser(data: SignupData): Promise<{ message: string }>;
    verifyOtp(email: string, otp: string): Promise<{ message: string; status: number }>;
  }
  