import { injectable, inject } from 'tsyringe';
import { IUserService, SignupData,LoginData  } from "./interfaces/IUserService";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
//import userRepository from "../repositories/userRepository";
import { TOKENS } from "../config/tokens";
import OTPService from "../utils/OTPService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IUser } from "../models/userModel";
import { UserMapper } from "../mappers/userMapper";
import { UserLoginResponseDto, UserGoogleAuthResponseDto, UserProfileUpdateDto, UserProfileResponseDto } from "../dtos/user.dto";

@injectable()
export class UserService implements IUserService {
     constructor(
    @inject(TOKENS.IUserRepository) private _userRepository: IUserRepository
  ) {}

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

    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      const error: any = new Error(MESSAGES.ERROR.EMAIL_EXISTS);
      error.status = STATUS_CODES.CONFLICT;
      throw error;
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = OTPService.generateOTP(); 
    console.log("Generated OTP:", otp);

    await this._userRepository.create({
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
    const user = await this._userRepository.findByEmail(email);

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


  async resendOtp(email: string): Promise<{ status: number; message: string }> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      const error: any = new Error("User not found");
      error.status = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    if (user.isVerified) {
      const error: any = new Error("User is already verified");
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

   
    const otp = OTPService.generateOTP();
    console.log("New OTP is:", otp);
    
    user.otp = otp;
    await user.save();

    
    await OTPService.sendOTP(email, otp);

    return { status: STATUS_CODES.OK, message: "New OTP sent successfully" };
  }



  async loginUser(data: LoginData): Promise<UserLoginResponseDto> {
    const { email, password } = data;

    if (!email || !password) {
      const error: any = new Error(MESSAGES.ERROR.INVALID_INPUT);
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const user = await this._userRepository.findByEmail(email);

   
    if (!user || !(await bcrypt.compare(password, user.password || ""))){
      const error: any = new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
      error.status = STATUS_CODES.UNAUTHORIZED;
      throw error;
    }

    if (user.status === "blocked") {
      const error: any = new Error("user is blocked");
      error.status = STATUS_CODES.UNAUTHORIZED;
      throw error;
    }

    if (!user.isVerified) {
      const error: any = new Error(MESSAGES.ERROR.UNAUTHORIZED);
      error.status = STATUS_CODES.UNAUTHORIZED;
      throw error;
    }


    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;



     if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
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

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);

  const token = jwt.sign({ userId: user._id, type: "user" }, jwtSecret, {
    expiresIn: "1h",
  });

  return UserMapper.toGoogleAuthResponse(user, token, MESSAGES.SUCCESS.LOGIN);
}


async forgotPassword(email: string): Promise<{ status: number; message: string }> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      const error: any = new Error(MESSAGES.ERROR.USER_NOT_FOUND);
      error.status = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    if (user.status === "blocked") {
      const error: any = new Error(MESSAGES.ERROR.FORBIDDEN);
      error.status = STATUS_CODES.FORBIDDEN;
      throw error;
    }

    
    const otp = OTPService.generateOTP();
    console.log("Password reset OTP:", otp);

    
    user.otp = otp;
    await user.save();

    
    await OTPService.sendOTP(email, otp);

    return { 
      status: STATUS_CODES.OK, 
      message: "Password reset OTP sent to your email" 
    };
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ status: number; message: string }> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      const error: any = new Error(MESSAGES.ERROR.USER_NOT_FOUND);
      error.status = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    if (user.otp !== otp) {
      const error: any = new Error(MESSAGES.ERROR.OTP_INVALID);
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    user.password = hashedPassword;
    user.otp = undefined;
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
      const error: any = new Error(MESSAGES.ERROR.USER_NOT_FOUND);
      error.status = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    return UserMapper.toProfileResponse(user, "Profile retrieved successfully");
  }

  async updateUserProfile(
    userId: string,
    data: UserProfileUpdateDto
  ): Promise<UserProfileResponseDto> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      const error: any = new Error(MESSAGES.ERROR.USER_NOT_FOUND);
      error.status = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    
    const updateData: Partial<IUser> = {};

    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;

    if (data.address) {
      updateData.address = {
        houseNo: data.address.houseNo ?? user.address?.houseNo ?? "",
        street: data.address.street ?? user.address?.street ?? "",
        city: data.address.city ?? user.address?.city ?? "",
        district: data.address.district ?? user.address?.district ?? "",
        state: data.address.state ?? user.address?.state ?? "",
        pincode: data.address.pincode ?? user.address?.pincode ?? "",
      };
    }

    const updatedUser = await this._userRepository.update(userId, updateData);

    if (!updatedUser) {
      const error: any = new Error(MESSAGES.ERROR.SERVER_ERROR);
      error.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      throw error;
    }

    return UserMapper.toProfileResponse(updatedUser, "Profile updated successfully");
  }

async updateUserProfileImage(userId: string, imageUrl: string): Promise<UserProfileResponseDto> {
  const user = await this._userRepository.findById(userId);

  if (!user) {
    const error: any = new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    error.status = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  const updatedUser = await this._userRepository.update(userId, {
    profileImage: imageUrl,
  });

  if (!updatedUser) {
    const error: any = new Error(MESSAGES.ERROR.SERVER_ERROR);
    error.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw error;
  }

  return UserMapper.toProfileResponse(updatedUser, "Profile image updated successfully");
}


   
}

//export default new UserService();

