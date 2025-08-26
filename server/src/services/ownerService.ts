
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
import { OwnerLoginResponseDto, OwnerProfileResponseDto, OwnerProfileUpdateDto } from "../dtos/owner.dto";
import { cloudinary } from '../config/cloudinary';

@injectable()

 export class OwnerService implements IOwnerService {
 constructor(
    @inject(TOKENS.IOwnerRepository) private _ownerRepository: IOwnerRepository
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

    const existingOwner = await this._ownerRepository.findByEmail(email);
    if (existingOwner) {
      const error: any = new Error(MESSAGES.ERROR.EMAIL_EXISTS);
      error.status = STATUS_CODES.CONFLICT;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = OTPService.generateOTP(); 
    console.log("Generated OTP:", otp);
    await this._ownerRepository.create({
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
      const owner = await this._ownerRepository.findByEmail(email);
  
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
        const owner = await this._ownerRepository.findByEmail(email);
    
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

  const owner = await this._ownerRepository.findByEmail(email);
  if (!owner || !(await bcrypt.compare(password, owner.password))) {
    const error: any = new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    error.status = STATUS_CODES.UNAUTHORIZED;
    throw error;
  }

  if (owner.isBlocked) {
    const error: any = new Error("Owner is blocked");
    error.status = STATUS_CODES.UNAUTHORIZED;
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
        const owner = await this._ownerRepository.findByEmail(email);
    
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
        const owner = await this._ownerRepository.findByEmail(email);
    
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


async getOwnerProfile(ownerId: string): Promise<OwnerProfileResponseDto> {
  const owner = await this._ownerRepository.findById(ownerId);
  
  if (!owner) {
    const error: any = new Error(MESSAGES.ERROR.VENDOR_NOT_FOUND);
    error.status = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  return OwnerMapper.toProfileResponse(owner, "Profile retrieved successfully");
}

async updateOwnerProfile(ownerId: string, data: OwnerProfileUpdateDto): Promise<OwnerProfileResponseDto> {
  const owner = await this._ownerRepository.findById(ownerId);
  
  if (!owner) {
    const error: any = new Error(MESSAGES.ERROR.VENDOR_NOT_FOUND);
    error.status = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  // Validate and update only provided fields
  //const updateData: Partial<IOwner> = {};
  const updateData: Partial<OwnerProfileUpdateDto> = {};

  if (data.name) updateData.name = data.name;
  if (data.phone) updateData.phone = data.phone;
  if (data.businessName) updateData.businessName = data.businessName;
  if (data.businessAddress) updateData.businessAddress = data.businessAddress;
  //if (data.profileImage) updateData.profileImage = data.profileImage;

  const updatedOwner = await this._ownerRepository.update(ownerId, updateData);
  
  if (!updatedOwner) {
    const error: any = new Error(MESSAGES.ERROR.SERVER_ERROR);
    error.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw error;
  }

  return OwnerMapper.toProfileResponse(updatedOwner, "Profile updated successfully");
}

async uploadDocument(ownerId: string, file: Express.Multer.File): Promise<{ message: string; status: number; document: string }> {
    try {
      // Check if owner exists and has pending/rejected status
      const owner = await this._ownerRepository.findById(ownerId);
      
      if (!owner) {
        const error: any = new Error(MESSAGES.ERROR.VENDOR_NOT_FOUND);
        error.status = STATUS_CODES.NOT_FOUND;
        throw error;
      }

      // Only allow upload if status is pending or rejected
      if (owner.approvalStatus === 'approved') {
        const error: any = new Error(MESSAGES.ERROR.ALREADY_APPROVED);
        error.status = STATUS_CODES.BAD_REQUEST;
        throw error;
      }

      // Delete existing documents from Cloudinary if any
      if (owner.document) {
        
          try {
            // Extract public_id from Cloudinary URL
            const publicId = owner.document.split('/').pop()?.split('.')[0];
            if (publicId) {
              await cloudinary.uploader.destroy(`staycasa/owner-documents/${publicId}`, { resource_type: 'auto' });
            }
          } catch (deleteError) {
            console.log('Error deleting old document:', deleteError);
          }
        
      }

      // Get URLs from uploaded files (already uploaded by multer-cloudinary)
      // const documentUrls = files.map(file => (file as any).path);
      const documentUrl = (file as any).path;
      // Update owner's documents
      const updatedOwner = await this._ownerRepository.updateDocument(ownerId, documentUrl);
      
      if (!updatedOwner) {
        const error: any = new Error(MESSAGES.ERROR.UPLOAD_FAILED);
        error.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        throw error;
      }

      return {
        message: "Documents uploaded successfully",
        status: STATUS_CODES.OK,
        document: documentUrl
      };
    } catch (error: any) {
      throw error;
    }
  }




}

//export default new OwnerService();
