
import { IOwnerService, OwnerSignupData } from "./interfaces/IOwnerService";
import ownerRepository from "../repositories/ownerRepository";
import OTPService from "../utils/OTPService"
import bcrypt from "bcryptjs";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

class OwnerService implements IOwnerService {
  async registerOwner(data: OwnerSignupData): Promise<{ status: number;message: string }> {
    const { name, email, phone, password, confirmPassword, businessName, businessAddress  } = data;

    if (!name || !email || !phone || !password || !confirmPassword || !businessName || !businessAddress) {
      const error: any = new Error(MESSAGES.ERROR.MISSING_FIELDS);
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    if (password !== confirmPassword) {
      const error: any = new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const existingOwner = await ownerRepository.findByEmail(email);
    if (existingOwner) {
      const error: any = new Error(MESSAGES.ERROR.EMAIL_EXISTS);
      error.status = STATUS_CODES.CONFLICT;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = OTPService.generateOTP(); 
    console.log("Generated OTP:", otp);
    await ownerRepository.create({
        name,
        email,
        phone,
        password: hashedPassword,
        businessName,
        businessAddress,
        isVerified: false,
        otp,
      });
      await OTPService.sendOTP(email, otp);
      return {status: STATUS_CODES.CREATED, message: "Owner registered successfully.Please verify OTP sent to your email." };
  }
  async verifyOtp(email: string, otp: string): Promise<{ status: number; message: string }> {
      const owner = await ownerRepository.findByEmail(email);
  
      if (!owner) {
        const error: any = new Error("User not found");
        error.status = STATUS_CODES.NOT_FOUND;
        throw error;
      }
  
      if (owner.otp !== otp) {
        const error: any = new Error("Invalid OTP");
        error.status = STATUS_CODES.BAD_REQUEST;
        throw error;
      }
  
      owner.isVerified = true;
      owner.otp = undefined;
      await owner.save();
  
      return { status: STATUS_CODES.OK, message: "Owner verified successfully" };
    }
}

export default new OwnerService();
