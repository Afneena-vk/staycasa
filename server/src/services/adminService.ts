import { injectable,inject } from 'tsyringe';
import {AdminLoginData, IAdminService} from './interfaces/IAdminService'
import { IAdminRepository } from '../repositories/interfaces/IAdminRepository';
import { TOKENS } from '../config/tokens';
//import adminRepository from '../repositories/adminRepository'
import OTPService from '../utils/OTPService'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { AdminMapper } from '../mappers/adminMapper';
import { AdminLoginResponseDto } from '../dtos/admin.dto';

@injectable()
export class AdminService implements IAdminService {

   constructor(
    @inject(TOKENS.IAdminRepository) private adminRepository: IAdminRepository
  ) {}

    async loginAdmin(data: AdminLoginData): Promise<AdminLoginResponseDto> {
    // async loginAdmin(data: AdminLoginData): Promise<{ token: string; message: string; admin: any;status: number }> {

        const { email, password } = data;
    
        if (!email || !password) {
          const error: any = new Error(MESSAGES.ERROR.INVALID_INPUT);
          error.status = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
    
        const admin = await this.adminRepository.findByEmail(email);
    
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
          const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    
        //  if (!JWT_SECRET) {
        //     throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
        //  }
         if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }
    
        // const token = jwt.sign({ id: admin._id, email: admin.email, type: "admin"}, JWT_SECRET, {
        //   expiresIn: "7d",
        // });
    
    const accessToken = jwt.sign(
      { userId: admin._id, email: admin.email, type: "admin" },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: admin._id, email: admin.email, type: "admin" },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

        // const { password: _, otp, ...adminData } = admin.toObject(); 
    
        // return {
        //   token,
        //   admin: adminData,
        //   message: MESSAGES.SUCCESS.LOGIN,
        //   status: STATUS_CODES.OK,
        // };
        return AdminMapper.toLoginResponse(admin, accessToken, refreshToken, MESSAGES.SUCCESS.LOGIN);
      }
}

//export default new AdminService();