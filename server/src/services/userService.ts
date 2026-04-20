import { injectable, inject } from 'tsyringe';
import { IUserService, SignupData,LoginData  } from "./interfaces/IUserService";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IWalletRepository } from '../repositories/interfaces/IWalletRepository';
import { INotificationService } from './interfaces/INotificationService';
//import userRepository from "../repositories/userRepository";
import { TOKENS } from "../config/tokens";
import OTPService from "../utils/OTPService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IUser } from "../models/userModel";
import { UserMapper } from "../mappers/userMapper";
import { UserLoginResponseDto, UserGoogleAuthResponseDto, UserProfileUpdateDto, UserProfileResponseDto, ChangePasswordResponseDto } from "../dtos/user.dto";
import { Types } from 'mongoose';
import { ITransaction } from '../models/walletModel';
import { FileStorageService } from '../utils/fileStorageService';
import { AppError } from '../utils/AppError';

@injectable()
export class UserService implements IUserService {
     constructor(
    @inject(TOKENS.IUserRepository) private _userRepository: IUserRepository,
    @inject(TOKENS.IWalletRepository) private _walletRepository: IWalletRepository,
    @inject(TOKENS.INotificationService) private _notificationService: INotificationService
  ) {}

  async registerUser(data: SignupData): Promise<{ status: number; message: string }> {
    

  let { name, email, phone, password, confirmPassword } = data;

  name = name?.trim();
  email = email?.trim().toLowerCase();
  phone = phone?.trim();

  password = password;
  confirmPassword = confirmPassword;

    if (!name || !email || !phone || !password || !confirmPassword) {

      throw new AppError(MESSAGES.ERROR.MISSING_FIELDS, STATUS_CODES.BAD_REQUEST);
    }



if (
  name.length < 3 ||
  !/^[A-Za-z\s'.-]+$/.test(name) ||
  !/[A-Za-z]/.test(name)
) {
  throw new AppError(
    "Enter a valid name",
    STATUS_CODES.BAD_REQUEST
  );
}


  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) {
    throw new AppError("Invalid email format", STATUS_CODES.BAD_REQUEST);
  }


  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    throw new AppError("Invalid phone number", STATUS_CODES.BAD_REQUEST);
  }


  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new AppError(
      "Password must be at least 8 characters and include letter, number and special character",
      STATUS_CODES.BAD_REQUEST
    );
  }

    if (password !== confirmPassword) {

       throw new AppError(MESSAGES.ERROR.PASSWORD_MISMATCH, STATUS_CODES.BAD_REQUEST);
    }

    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {

       throw new AppError(MESSAGES.ERROR.EMAIL_EXISTS,  STATUS_CODES.CONFLICT);
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = OTPService.generateOTP(); 
    console.log("Generated OTP:", otp);

    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this._userRepository.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiresAt,
    });

    await OTPService.sendOTP(email, otp);

    return { status: STATUS_CODES.CREATED,message: "User registered successfully.Please verify OTP sent to your email." };
    }

  async verifyOtp(email: string, otp: string): Promise<{ status: number; message: string }> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(MESSAGES.ERROR.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new AppError("OTP expired", STATUS_CODES.BAD_REQUEST);
  }

    if (user.otp !== otp) {
        throw new AppError(MESSAGES.ERROR.OTP_INVALID, STATUS_CODES.BAD_REQUEST);
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return { status: STATUS_CODES.OK, message: "User verified successfully" };
  }


  async resendOtp(email: string): Promise<{ status: number; message: string }> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {

      throw new AppError(MESSAGES.ERROR.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (user.isVerified) {

       throw new AppError("User is already verified", STATUS_CODES.BAD_REQUEST);
    }

  const cooldown = 60 * 1000; 

  if (
    user.otpExpiresAt &&
    (user.otpExpiresAt.getTime() - Date.now()) > (5 * 60 * 1000 - cooldown)
  ) {
    throw new AppError(
      "Please wait before requesting a new OTP",
      STATUS_CODES.TOO_MANY_REQUESTS
    );
  }    
   
    const otp = OTPService.generateOTP();
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    console.log("New OTP is:", otp);
    
    user.otp = otp;
    await user.save();

    
    await OTPService.sendOTP(email, otp);

    return { status: STATUS_CODES.OK, message: "New OTP sent successfully" };
  }



  async loginUser(data: LoginData): Promise<UserLoginResponseDto> {
    const { email, password } = data;

    if (!email || !password) {

      throw new AppError(MESSAGES.ERROR.INVALID_INPUT, STATUS_CODES.BAD_REQUEST);
    }

    const user = await this._userRepository.findByEmail(email);

   
    if (!user || !(await bcrypt.compare(password, user.password || ""))){

        throw new AppError(MESSAGES.ERROR.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);

    }

    if (user.status === "blocked") {

      throw new AppError("user is blocked", STATUS_CODES.UNAUTHORIZED);
    }

    if (!user.isVerified) {

       throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    }


    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;



     if (!JWT_SECRET || !JWT_REFRESH_SECRET) {

    throw new AppError( MESSAGES.ERROR.JWT_SECRET_MISSING, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }




     const accessToken = jwt.sign({ userId: user._id, email: user.email, type: "user" }, JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId: user._id, email: user.email, type: "user" }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
 
   
    return UserMapper.toLoginResponse(user, accessToken, refreshToken, MESSAGES.SUCCESS.LOGIN);
  }


  

  async processGoogleAuth(profile: any): Promise<UserGoogleAuthResponseDto> {
  const email = profile.email;
  let user = await this._userRepository.findByEmail(email);

  if (user && !user.googleId) {
    user.googleId = profile.id;
    await this._userRepository.update(user._id.toString(), user);
  }

  if (!user) {
    user = await this._userRepository.create({
      googleId: profile.id,
      name: profile.displayName,
      email,
      password: "",
      isVerified: true,
    });
  }

  //const jwtSecret = process.env.JWT_SECRET;
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

     if (!JWT_SECRET || !JWT_REFRESH_SECRET) {

    throw new AppError(MESSAGES.ERROR.JWT_SECRET_MISSING, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

 
  const accessToken = jwt.sign({ userId: user._id, email: user.email, type: "user" }, JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId: user._id, email: user.email, type: "user" }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });


 

  return UserMapper.toGoogleAuthResponse(user, accessToken, refreshToken, MESSAGES.SUCCESS.LOGIN);
}


async forgotPassword(email: string): Promise<{ status: number; message: string }> {


  email = email?.trim().toLowerCase();


  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (!emailRegex.test(email)) {
    throw new AppError("Invalid email format", STATUS_CODES.BAD_REQUEST);
  }

    const user = await this._userRepository.findByEmail(email);

    if (!user) {

        throw new AppError(MESSAGES.ERROR.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (user.status === "blocked") {

       throw new AppError(MESSAGES.ERROR.FORBIDDEN, STATUS_CODES.FORBIDDEN);
    }

    
    const otp = OTPService.generateOTP();
    console.log("Password reset OTP:", otp);

    
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    
    await OTPService.sendOTP(email, otp);

    return { 
      status: STATUS_CODES.OK, 
      message: "Password reset OTP sent to your email" 
    };
  }

 
   async resetPassword(email: string, otp: string, newPassword: string,  confirmPassword: string): Promise<{ status: number; message: string }> { 


  email = email?.trim().toLowerCase();
  otp = otp?.trim();

    if (!email || !otp || !newPassword ||  !confirmPassword) {
    throw new AppError("All fields are required", STATUS_CODES.BAD_REQUEST);
  }

    const user = await this._userRepository.findByEmail(email);

    if (!user) {

        throw new AppError(MESSAGES.ERROR.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }  


if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
  throw new AppError("OTP expired", STATUS_CODES.BAD_REQUEST);
}


    
    if (!user.otp || user.otp !== otp) {
       throw new AppError(MESSAGES.ERROR.OTP_INVALID, STATUS_CODES.BAD_REQUEST);
    }


    
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  

  if (!passwordRegex.test(newPassword)) {
    throw new AppError(
      "Password must be at least 8 characters and include letter, number and special character",
      STATUS_CODES.BAD_REQUEST
    );
  }

if (newPassword !== confirmPassword) {
  throw new AppError("Passwords do not match", STATUS_CODES.BAD_REQUEST);
}


    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return { 
      status: STATUS_CODES.OK, 
      message: MESSAGES.SUCCESS.PASSWORD_RESET 
    };
  }  

async getUserProfile(userId: string): Promise<UserProfileResponseDto> {
    // const user: IUser | null = await this._userRepository.findById(userId);
    const user = await this._userRepository.findById(userId);


    if (!user) {

      throw new AppError(MESSAGES.ERROR.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    return UserMapper.toProfileResponse(user, "Profile retrieved successfully");
  }

  async updateUserProfile(
    userId: string,
    data: UserProfileUpdateDto
  ): Promise<UserProfileResponseDto> {

    const user = await this._userRepository.findById(userId);

    if (!user) {

      throw new AppError(MESSAGES.ERROR.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    
    const updateData: Partial<IUser> = {};

    // if (data.name) updateData.name = data.name;
    // if (data.phone) updateData.phone = data.phone;

      if (data.name !== undefined) {
    const name = data.name.trim();

    if (!name) {
      throw new AppError("Name is required", STATUS_CODES.BAD_REQUEST);
    }



if (
  name.length < 3 ||
  !/^[A-Za-z\s'.-]+$/.test(name) ||
  !/[A-Za-z]/.test(name)
) {
  throw new AppError(
    "Enter a valid name",
    STATUS_CODES.BAD_REQUEST
  );
}

    updateData.name = name;
  }

    if (data.phone !== undefined) {
    const phone = data.phone?.trim() || "";
    

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      throw new AppError(
        "Invalid phone number",
        STATUS_CODES.BAD_REQUEST
      );
    }

    updateData.phone = phone;
  }


 if (data.address) {
  const { houseNo, street, city, district, state, pincode } = data.address;

  const isAllEmpty =
    !houseNo?.trim() &&
    !street?.trim() &&
    !city?.trim() &&
    !district?.trim() &&
    !state?.trim() &&
    !pincode?.trim();

 
  if (isAllEmpty) {
    // updateData.address = undefined; // or skip setting
  } else {
   
    if (
      !houseNo?.trim() ||
      !street?.trim() ||
      !city?.trim() ||
      !district?.trim() ||
      !state?.trim() ||
      !pincode?.trim()
    ) {
      throw new AppError(
        "All address fields are required",
        STATUS_CODES.BAD_REQUEST
      );
    }

    
    if (!/^\d{6}$/.test(pincode)) {
      throw new AppError(
        "Pincode must be 6 digits",
        STATUS_CODES.BAD_REQUEST
      );
    }

    
    updateData.address = {
      houseNo: houseNo.trim(),
      street: street.trim(),
      city: city.trim(),
      district: district.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    };
  }
} 

    // const updatedUser = await this._userRepository.update(userId, updateData);
    const updatedUser = await this._userRepository.updateUserSafe(userId, updateData);

    if (!updatedUser) {

      throw new AppError(MESSAGES.ERROR.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    return UserMapper.toProfileResponse(updatedUser, "Profile updated successfully");
  }

// async updateUserProfileImage(userId: string, imageUrl: string): Promise<UserProfileResponseDto> {
async updateUserProfileImage(userId: string, fileData: { url: string; publicId: string }): Promise<UserProfileResponseDto> {
  const user = await this._userRepository.findById(userId);

  if (!user) {

     throw new AppError(MESSAGES.ERROR.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

    if (user.profileImage?.publicId) {
    await FileStorageService.delete(user.profileImage.publicId);
    
  }


  // const updatedUser = await this._userRepository.update(userId, {
  //   profileImage: imageUrl,
  // });

  const updatedUser = await this._userRepository.update(userId, {
    profileImage: fileData,
  });

  if (!updatedUser) {

     throw new AppError(MESSAGES.ERROR.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  return UserMapper.toProfileResponse(updatedUser, "Profile image updated successfully");
}

async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<ChangePasswordResponseDto> {
  
  const user = await this._userRepository.findById(userId);
  if (!user) {

     throw new AppError(MESSAGES.ERROR.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  
  if (!user.password) {

    throw new AppError("Password not set for this user", STATUS_CODES.BAD_REQUEST);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {

    throw new AppError("Current password is incorrect", STATUS_CODES.BAD_REQUEST);

  }

  
   if (currentPassword === newPassword) {
    throw new AppError(
      "New password must be different from current password",
      STATUS_CODES.BAD_REQUEST
    );
  }

   const passwordRegex =
    // /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  if (!passwordRegex.test(newPassword)) {
    throw new AppError(
      "Password must be at least 8 characters and include letter, number and special character",
      STATUS_CODES.BAD_REQUEST
    );
  }


  
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  
  const updatedUser = await this._userRepository.update(userId, { password: hashedPassword });
  if (!updatedUser) {

     throw new AppError("Failed to update password", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

await this._notificationService.createNotification(
        userId,
        "User",
        "system",
        "Password Changed",
        "Your password was changed successfully. If this wasn’t you, please contact support immediately."
        
      );

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
    "user",
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

//export default new UserService();

