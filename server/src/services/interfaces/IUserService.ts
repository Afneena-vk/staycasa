



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
    registerUser(data: SignupData): Promise<{ message: string }>;
    verifyOtp(email: string, otp: string): Promise<{ message: string; status: number }>;
    resendOtp(email: string): Promise<{ message: string; status: number }>;
    loginUser(data: LoginData): Promise<{ token: string; user: any; message: string; status: number; }>;
    processGoogleAuth(profile: any): Promise<{ token: string; user: any; message: string; status: number }>;


    //  forgotPassword(email: string): Promise<{ message: string; status: number }>;
    // verifyResetOtp(email: string, otp: string): Promise<{ message: string; status: number }>;
    // resetPassword(data: ResetPasswordData): Promise<{ message: string; status: number }>;
  }
  