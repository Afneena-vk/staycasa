
import { IOwnerService, OwnerSignupData, OwnerLoginData } from "./interfaces/IOwnerService";
import ownerRepository from "../repositories/ownerRepository";
import OTPService from "../utils/OTPService"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
//import {IOwner} from '../models/ownerModel'

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
        const error: any = new Error("Owner not found");
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

      async resendOtp(email: string): Promise<{ status: number; message: string }> {
        const owner = await ownerRepository.findByEmail(email);
    
        if (!owner) {
          const error: any = new Error("Owner not found");
          error.status = STATUS_CODES.NOT_FOUND;
          throw error;
        }
    
        if (owner.isVerified) {
          const error: any = new Error("Owner is already verified");
          error.status = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
    
        // Generate new OTP
        const otp = OTPService.generateOTP();
        console.log("New OTP is:", otp);
        // Update owner with new OTP
        owner.otp = otp;
        await owner.save();
    
        // Send new OTP to email
        await OTPService.sendOTP(email, otp);
    
        return { status: STATUS_CODES.OK, message: "New OTP sent successfully" };
      }
    
    async loginOwner(data: OwnerLoginData): Promise<{
      token: string;
      owner: any;
      message: string;
      status: number;
    }> {
      const { email, password } = data;
  
      if (!email || !password) {
        const error: any = new Error(MESSAGES.ERROR.INVALID_INPUT);
        error.status = STATUS_CODES.BAD_REQUEST;
        throw error;
      }
  
      const owner = await ownerRepository.findByEmail(email);
      if (!owner) {
        const error: any = new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
        error.status = STATUS_CODES.UNAUTHORIZED;
        throw error;
      }
  
      if (owner.isBlocked) {
        const error: any = new Error(MESSAGES.ERROR.FORBIDDEN);
        error.status = STATUS_CODES.FORBIDDEN;
        throw error;
      }
  
      if (!owner.isVerified) {
        const error: any = new Error(MESSAGES.ERROR.UNAUTHORIZED);
        error.status = STATUS_CODES.UNAUTHORIZED;
        throw error;
      }
  
      const isPasswordValid = await bcrypt.compare(password, owner.password);
      if (!isPasswordValid) {
        const error: any = new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
        error.status = STATUS_CODES.UNAUTHORIZED;
        throw error;
      }
  
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
      }
  
      const token = jwt.sign({ userId: owner._id, email: owner.email, type: "owner" }, JWT_SECRET, {
        expiresIn: "7d",
      });
  
      const { password: _, otp, ...ownerData } = owner.toObject();
  
      return {
        token,
        owner: ownerData,
        message: MESSAGES.SUCCESS.LOGIN,
        status: STATUS_CODES.OK,
      };
    }
}

export default new OwnerService();
