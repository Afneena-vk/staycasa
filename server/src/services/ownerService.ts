
import {injectable, inject } from 'tsyringe';
import { IOwnerService, OwnerSignupData, OwnerLoginData } from "./interfaces/IOwnerService";
//import ownerRepository from "../repositories/ownerRepository";
import { IOwnerRepository } from '../repositories/interfaces/IOwnerRepository';
import { IWalletRepository } from '../repositories/interfaces/IWalletRepository';
import { IAdminRepository } from '../repositories/interfaces/IAdminRepository';
import { INotificationService } from './interfaces/INotificationService';
import { TOKENS } from '../config/tokens';
import OTPService from "../utils/OTPService"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
//import {IOwner} from '../models/ownerModel'
import { OwnerMapper } from "../mappers/ownerMapper";
import { OwnerLoginResponseDto, OwnerProfileResponseDto, OwnerProfileUpdateDto, ChangePasswordResponseDto } from "../dtos/owner.dto";
import { cloudinary } from '../config/cloudinary';
import { Types } from "mongoose";
import { ITransaction } from '../models/walletModel';
import { AppError } from '../utils/AppError';

@injectable()

 export class OwnerService implements IOwnerService {
 constructor(
    @inject(TOKENS.IOwnerRepository) private _ownerRepository: IOwnerRepository,
    @inject(TOKENS.IWalletRepository) private _walletRepository: IWalletRepository,
    @inject(TOKENS.IAdminRepository) private _adminRepository: IAdminRepository,
    @inject(TOKENS.INotificationService) private _notificationService: INotificationService
  ) {}


  async registerOwner(data: OwnerSignupData): Promise<{ status: number;message: string }> {
    const { name, email, phone, password, confirmPassword, businessName, businessAddress  } = data;

    if (!name || !email || !phone || !password || !confirmPassword || !businessName || !businessAddress) {

      throw new AppError(MESSAGES.ERROR.MISSING_FIELDS, STATUS_CODES.BAD_REQUEST);
    }

    if (password !== confirmPassword) {

      throw new AppError(MESSAGES.ERROR.PASSWORD_MISMATCH, STATUS_CODES.BAD_REQUEST);
    }

    const existingOwner = await this._ownerRepository.findByEmail(email);
    if (existingOwner) {

       throw new AppError(MESSAGES.ERROR.EMAIL_EXISTS, STATUS_CODES.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = OTPService.generateOTP(); 
    console.log("Generated OTP:", otp);
    const owner =await this._ownerRepository.create({
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

  const admin = await this._adminRepository.findOne({});
  if (admin) {
    
    await this._notificationService.createNotification(
      admin._id.toString(),         
      "Admin",                     
      "system",         
      "New Owner Registered",        
      `Owner ${owner.name} has registered. Verify their account.`,
      owner._id.toString()         
    );
  }


      return {status: STATUS_CODES.CREATED, message: "Owner registered successfully.Please verify OTP sent to your email." };
  }
  async verifyOtp(email: string, otp: string): Promise<{ status: number; message: string }> {
      const owner = await this._ownerRepository.findByEmail(email);
  
      if (!owner) {

        throw new AppError("Owner not found", STATUS_CODES.NOT_FOUND);
      }
  
      if (owner.otp !== otp) {

        throw new AppError("Invalid OTP", STATUS_CODES.BAD_REQUEST);

      }
  
      owner.isVerified = true;
      owner.otp = undefined;
      await owner.save();
  
      return { status: STATUS_CODES.OK, message: "Owner verified successfully" };
    }

      async resendOtp(email: string): Promise<{ status: number; message: string }> {
        const owner = await this._ownerRepository.findByEmail(email);
    
        if (!owner) {

          throw new AppError("Owner not found", STATUS_CODES.NOT_FOUND);
        }
    
        if (owner.isVerified) {

          throw new AppError("Owner is already verified", STATUS_CODES.BAD_REQUEST);
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

     throw new AppError(MESSAGES.ERROR.INVALID_INPUT, STATUS_CODES.BAD_REQUEST);
  }

  const owner = await this._ownerRepository.findByEmail(email);
  if (!owner || !(await bcrypt.compare(password, owner.password))) {

     throw new AppError(MESSAGES.ERROR.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
  }

  if (owner.isBlocked) {

      throw new AppError("Owner is blocked", STATUS_CODES.UNAUTHORIZED);
  }

  if (!owner.isVerified) {

     throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    // throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    throw new AppError( MESSAGES.ERROR.JWT_SECRET_MISSING, STATUS_CODES.INTERNAL_SERVER_ERROR);
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

          throw new AppError(MESSAGES.ERROR.VENDOR_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        }
    
        if (owner.isBlocked) {

           throw new AppError(MESSAGES.ERROR.FORBIDDEN, STATUS_CODES.FORBIDDEN);
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

           throw new AppError(MESSAGES.ERROR.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        }
    
        if (owner.otp !== otp) {

          throw new AppError(MESSAGES.ERROR.OTP_INVALID, STATUS_CODES.BAD_REQUEST);
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

        throw new AppError(MESSAGES.ERROR.VENDOR_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  return OwnerMapper.toProfileResponse(owner, "Profile retrieved successfully");
}

async updateOwnerProfile(ownerId: string, data: OwnerProfileUpdateDto): Promise<OwnerProfileResponseDto> {
  const owner = await this._ownerRepository.findById(ownerId);
  
  if (!owner) {

        throw new AppError(MESSAGES.ERROR.VENDOR_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }


  //const updateData: Partial<IOwner> = {};
  const updateData: Partial<OwnerProfileUpdateDto> = {};

  if (data.name) updateData.name = data.name;
  if (data.phone) updateData.phone = data.phone;
  if (data.businessName) updateData.businessName = data.businessName;
  if (data.businessAddress) updateData.businessAddress = data.businessAddress;
  //if (data.profileImage) updateData.profileImage = data.profileImage;

  const updatedOwner = await this._ownerRepository.update(ownerId, updateData);
  
  if (!updatedOwner) {

       throw new AppError(MESSAGES.ERROR.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  return OwnerMapper.toProfileResponse(updatedOwner, "Profile updated successfully");
}

async uploadDocument(ownerId: string, file: Express.Multer.File): Promise<{ message: string; status: number; document: string }> {
    try {
    
      const owner = await this._ownerRepository.findById(ownerId);
      
      if (!owner) {

        throw new AppError(MESSAGES.ERROR.VENDOR_NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }

      
      if (owner.approvalStatus === 'approved') {

         throw new AppError(MESSAGES.ERROR.ALREADY_APPROVED, STATUS_CODES.BAD_REQUEST);
      }

      
      if (owner.document) {
        
          try {
          
            const publicId = owner.document.split('/').pop()?.split('.')[0];
            if (publicId) {
              await cloudinary.uploader.destroy(`staycasa/owner-documents/${publicId}`, { resource_type: 'auto' });
            }
          } catch (deleteError) {
            console.log('Error deleting old document:', deleteError);
          }
        
      }

      
      const documentUrl = (file as any).path;
     
      const updatedOwner = await this._ownerRepository.updateDocument(ownerId, documentUrl);


       const admin = await this._adminRepository.findOne({});

   if(admin){
    await this._notificationService.createNotification(
      admin._id.toString(),      
      "Admin",                     
      "system",         
      "Document uploaded",        
      `Owner ${owner.name} has uploaded a document for verification.`, 
              
    );
  }
      
      if (!updatedOwner) {

        throw new AppError(MESSAGES.ERROR.UPLOAD_FAILED, STATUS_CODES.INTERNAL_SERVER_ERROR);
      }

      return {
        message: "Documents uploaded successfully",
        status: STATUS_CODES.OK,
        document: documentUrl
      };

     } catch (error: unknown) {
  throw error;
}
  }

async changePassword(ownerId: string, currentPassword: string, newPassword: string): Promise<ChangePasswordResponseDto> {
  
  const owner = await this._ownerRepository.findById(ownerId);
  if (!owner) {

      throw new AppError(MESSAGES.ERROR.VENDOR_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  
  if (!owner.password) {

      throw new AppError("Password not set for this owner", STATUS_CODES.BAD_REQUEST);
  }

  const isMatch = await bcrypt.compare(currentPassword, owner.password);
  if (!isMatch) {

      throw new AppError("Current password is incorrect", STATUS_CODES.BAD_REQUEST);
  }

  
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  
  const updatedOwner = await this._ownerRepository.update(ownerId, { password: hashedPassword });
      await this._notificationService.createNotification(
      ownerId,      
      "Owner",                     
      "system",         
      "Password Changed",        
      `Your password was changed successfully. If this wasn’t you, please contact support immediately..`,
              
    );

  if (!updatedOwner) {

     throw new AppError("Failed to update password", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

    return {
    message: "Password changed successfully",
    status:  STATUS_CODES.OK,
  };
}




async getWallet(ownerId: string, page: number, limit: number): Promise<{
  balance: number;
  transactions: ITransaction[];
  totalTransactions: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const wallet = await this._walletRepository.getWalletWithBookings(
    new Types.ObjectId(ownerId),
    "owner",
    page,
    limit
  );

  if (!wallet) {
    return {
      balance: 0,
      transactions: [],
      totalTransactions: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  return {
    balance: wallet.balance,
    transactions: wallet.transactions,
    totalTransactions: wallet.totalTransactions,
    page,
    limit,
    totalPages: Math.ceil(wallet.totalTransactions / limit),
  };
}


}

//export default new OwnerService();
