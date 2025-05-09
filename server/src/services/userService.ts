
import { IUserService, SignupData } from "./interfaces/IUserService";
import userRepository from "../repositories/userRepository";
import OTPService from "../utils/OTPService";
import bcrypt from "bcryptjs";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

class UserService implements IUserService {
  async registerUser(data: SignupData): Promise<{ status: number; message: string }> {
    const { name, email, phone, password, confirmPassword } = data;

    if (!name || !email || !phone || !password || !confirmPassword) {
      const error: any = new Error(MESSAGES.ERROR.MISSING_FIELDS);
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    if (password !== confirmPassword) {
      const error: any = new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error: any = new Error(MESSAGES.ERROR.EMAIL_EXISTS);
      error.status = STATUS_CODES.CONFLICT;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = OTPService.generateOTP(); 
    console.log("Generated OTP:", otp);
    await userRepository.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
      otp,
    });

    await OTPService.sendOTP(email, otp);
    return { status: STATUS_CODES.CREATED,message: "User registered successfully.Please verify OTP sent to your email." };
  }
  async verifyOtp(email: string, otp: string): Promise<{ status: number; message: string }> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      const error: any = new Error("User not found");
      error.status = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    if (user.otp !== otp) {
      const error: any = new Error("Invalid OTP");
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    return { status: STATUS_CODES.OK, message: "User verified successfully" };
  }
}

export default new UserService();
