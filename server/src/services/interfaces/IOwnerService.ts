// src/services/interfaces/IOwnerService.ts

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
    registerOwner(data: OwnerSignupData): Promise<{ message: string }>;
    verifyOtp(email: string, otp: string): Promise<{ message: string; status: number }>;
    loginOwner(data: OwnerLoginData): Promise<{
      token: string;
      owner: any;
      message: string;
      status: number;
    }>;
  }
  