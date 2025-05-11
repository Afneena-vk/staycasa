
import { IUserService, SignupData,LoginData  } from "./interfaces/IUserService";
import userRepository from "../repositories/userRepository";
import OTPService from "../utils/OTPService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IUser } from "../models/userModel";

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

  async loginUser(data: LoginData): Promise<{ token: string; message: string; user: any;status: number }> {
    const { email, password } = data;

    if (!email || !password) {
      const error: any = new Error(MESSAGES.ERROR.INVALID_INPUT);
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const user = await userRepository.findByEmail(email);

    if (!user) {
      const error: any = new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
      error.status = STATUS_CODES.UNAUTHORIZED;
      throw error;
    }

    if (user.status === "blocked") {
      const error: any = new Error(MESSAGES.ERROR.FORBIDDEN);
      error.status = STATUS_CODES.FORBIDDEN;
      throw error;
    }

    if (!user.isVerified) {
      const error: any = new Error(MESSAGES.ERROR.UNAUTHORIZED);
      error.status = STATUS_CODES.UNAUTHORIZED;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");

    if (!isPasswordValid) {
      const error: any = new Error("Invalid email or password");
      error.status = STATUS_CODES.UNAUTHORIZED;
      throw error;
    }

    const JWT_SECRET = process.env.JWT_SECRET;

     if (!JWT_SECRET) {
        throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
     }


    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, otp, ...userData } = user.toObject(); // remove password and otp

    return {
      token,
      user: userData,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }


  async processGoogleAuth(
    profile: any
  ): Promise<{ user: IUser; token: string; message: string; status: number }> {
    const email = profile.email;
  
    let user = await userRepository.findByEmail(email);
  
    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await userRepository.update(user._id.toString(), user);
      }
    } else {
      user = await userRepository.create({
        googleId: profile.id,
        name: profile.displayName,
        email,
        password: "", // Not needed for Google users
        isVerified: true,
      });
    }
  
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }
  
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });
  
   
    const { password: _, otp, ...userData } = user.toObject();
  
    return {
      user: userData,
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }
  
  
}

export default new UserService();
