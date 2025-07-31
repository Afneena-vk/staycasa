
import {injectable, inject } from 'tsyringe';
import { IOwnerService, OwnerSignupData, OwnerLoginData } from "./interfaces/IOwnerService";
//import ownerRepository from "../repositories/ownerRepository";
import { IOwnerRepository } from '../repositories/interfaces/IOwnerRepository';
import { TOKENS } from '../config/tokens';
import OTPService from "../utils/OTPService"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
//import {IOwner} from '../models/ownerModel'
import { OwnerMapper } from "../mappers/ownerMapper";
import { OwnerLoginResponseDto } from "../dtos/owner.dto";

@injectable()

 export class OwnerService implements IOwnerService {
 constructor(
    @inject(TOKENS.IOwnerRepository) private ownerRepository: IOwnerRepository
  ) {}


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

    const existingOwner = await this.ownerRepository.findByEmail(email);
    if (existingOwner) {
      const error: any = new Error(MESSAGES.ERROR.EMAIL_EXISTS);
      error.status = STATUS_CODES.CONFLICT;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = OTPService.generateOTP(); 
    console.log("Generated OTP:", otp);
    await this.ownerRepository.create({
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
      const owner = await this.ownerRepository.findByEmail(email);
  
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
        const owner = await this.ownerRepository.findByEmail(email);
    
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
    
       
        const otp = OTPService.generateOTP();
        console.log("New OTP is:", otp);
        
        owner.otp = otp;
        await owner.save();
    
    
        await OTPService.sendOTP(email, otp);
    
        return { status: STATUS_CODES.OK, message: "New OTP sent successfully" };
      }
    
   

    async loginOwner(data: OwnerLoginData): Promise<OwnerLoginResponseDto> {
  const { email, password } = data;

  if (!email || !password) {
    const error: any = new Error(MESSAGES.ERROR.INVALID_INPUT);
    error.status = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  const owner = await this.ownerRepository.findByEmail(email);
  if (!owner || !(await bcrypt.compare(password, owner.password))) {
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

  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
  }

  const accessToken = jwt.sign(
    { userId: owner._id, email: owner.email, type: "owner" },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: owner._id, email: owner.email, type: "owner" },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return OwnerMapper.toLoginResponse(owner, accessToken, refreshToken, MESSAGES.SUCCESS.LOGIN);
}

    async forgotPassword(email: string): Promise<{ status: number; message: string }> {
        const owner = await this.ownerRepository.findByEmail(email);
    
        if (!owner) {
          const error: any = new Error(MESSAGES.ERROR.VENDOR_NOT_FOUND);
          error.status = STATUS_CODES.NOT_FOUND;
          throw error;
        }
    
        if (owner.isBlocked) {
          const error: any = new Error(MESSAGES.ERROR.FORBIDDEN);
          error.status = STATUS_CODES.FORBIDDEN;
          throw error;
        }
    
        
        const otp = OTPService.generateOTP();
        console.log("Password reset OTP:", otp);
    
        
        owner.otp = otp;
        await owner.save();
    
        
        await OTPService.sendOTP(email, otp);
    
        return { 
          status: STATUS_CODES.OK, 
          message: "Password reset OTP sent to your email" 
        };
      }
    
      async resetPassword(email: string, otp: string, newPassword: string): Promise<{ status: number; message: string }> {
        const owner = await this.ownerRepository.findByEmail(email);
    
        if (!owner) {
          const error: any = new Error(MESSAGES.ERROR.USER_NOT_FOUND);
          error.status = STATUS_CODES.NOT_FOUND;
          throw error;
        }
    
        if (owner.otp !== otp) {
          const error: any = new Error(MESSAGES.ERROR.OTP_INVALID);
          error.status = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
    
     
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        
        owner.password = hashedPassword;
        owner.otp = undefined;
        await owner.save();
    
        return { 
          status: STATUS_CODES.OK, 
          message: MESSAGES.SUCCESS.PASSWORD_RESET 
        };
      }
}

//export default new OwnerService();
