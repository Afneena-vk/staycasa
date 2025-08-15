import { injectable, inject } from "tsyringe";
import { IOwnerController } from "./interfaces/IOwnerController";
import { Request, Response, NextFunction } from "express";
//import ownerService from "../services/ownerService";
import { IOwnerService } from "../services/interfaces/IOwnerService";
import { TOKENS } from "../config/tokens";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

@injectable()
export class OwnerController implements IOwnerController {
    constructor(
    @inject(TOKENS.IOwnerService) private _ownerService: IOwnerService
  ) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this._ownerService.registerOwner(req.body); 
   
    res.status(result.status).json({
        message: result.message,
      });
  
  } catch (error: any) {
    logger.error("Registartion failed",error);
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
  }
   async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { email, otp } = req.body;
  
        if (!email || !otp) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Email and OTP are required" });
          return;
        }
  
        const result = await this._ownerService.verifyOtp(email, otp);
        res.status(result.status).json({ message: result.message });
    
    } catch (error: any) {
      logger.error("OTP verification error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }

  }

    async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { email } = req.body;
  
        if (!email) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Email is required" });
          return;
        }
  
        const result = await this._ownerService.resendOtp(email);
        res.status(result.status).json({ message: result.message });
      } catch (error: any) {
        //console.error("OTP resend error:", error);
        logger.error("OTP resend error:",error);
        res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        });
      }
    }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this._ownerService.loginOwner(req.body);

       res.cookie("auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        //maxAge: 7 * 24 * 60 * 60 * 1000, 
        maxAge: 15 * 60 * 1000,
        path: "/",
      });
      
      res.cookie("refresh-token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    
      res.status(result.status).json({
  message: result.message,

   
   owner: {
    id: result.id,
    name: result.name,
    email: result.email,
    phone: result.phone,
    //status: result.userStatus,
    isBlocked: result.isBlocked,
    isVerified: result.isVerified,
  },
 
   accessToken: result.token,
   refreshToken: result.refreshToken,
});

      //res.status(STATUS_CODES.OK).json(result);
    } catch (error: any) {
      console.error("Owner login error:", error);
      logger.error('Login error: " + error.message');
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ 
          error: "Email is required" 
        });
        return;
      }

      const result = await this._ownerService.forgotPassword(email);
      res.status(result.status).json({ 
        message: result.message 
      });
    } catch (error: any) {
      logger.error("Forgot password error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp, newPassword, confirmPassword } = req.body;

      if (!email || !otp || !newPassword || !confirmPassword) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ 
          error: "All fields are required" 
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ 
          error: MESSAGES.ERROR.PASSWORD_MISMATCH 
        });
        return;
      }

      const result = await this._ownerService.resetPassword(email, otp, newPassword);
      res.status(result.status).json({ 
        message: result.message 
      });
    } catch (error: any) {
      
      logger.error("Reset password error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }


}

//export default new OwnerController();
