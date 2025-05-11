import {AdminLoginData, IAdminService} from './interfaces/IAdminService'
import adminRepository from '../repositories/adminRepository'
import OTPService from '../utils/OTPService'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

class AdminService implements IAdminService {
    async loginAdmin(data: AdminLoginData): Promise<{ token: string; message: string; admin: any;status: number }> {
        const { email, password } = data;
    
        if (!email || !password) {
          const error: any = new Error(MESSAGES.ERROR.INVALID_INPUT);
          error.status = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
    
        const admin = await adminRepository.findByEmail(email);
    
        if (!admin) {
          const error: any = new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
          error.status = STATUS_CODES.UNAUTHORIZED;
          throw error;
        }
    
        const isPasswordValid = await bcrypt.compare(password, admin.password || "");
    
        if (!isPasswordValid) {
          const error: any = new Error("Invalid email or password");
          error.status = STATUS_CODES.UNAUTHORIZED;
          throw error;
        }
    
        const JWT_SECRET = process.env.JWT_SECRET;
    
         if (!JWT_SECRET) {
            throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
         }
    
    
        const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, {
          expiresIn: "7d",
        });
    
        const { password: _, otp, ...adminData } = admin.toObject(); // remove password and otp
    
        return {
          token,
          admin: adminData,
          message: MESSAGES.SUCCESS.LOGIN,
          status: STATUS_CODES.OK,
        };
      }
}

export default new AdminService();