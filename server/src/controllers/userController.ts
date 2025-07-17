import { IUserController } from "./interfaces/IUserController";
import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import jwt from "jsonwebtoken";
import logger
 from "../utils/logger";

class UserController implements IUserController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.registerUser(req.body); 
    //   res.status(STATUS_CODES.CREATED).json({
    //     message: MESSAGES.SUCCESS.SIGNUP,
    //     details: result.message, // or just use message: result.message
    //   });
    res.status(result.status).json({
        message: result.message,
      });

    // } catch (error) {
    //   console.error("Registration error:", error);
    //   next(error);
    // }
  } catch (error: any) {
    //console.error("Registration error:", error);
    logger.error("Registration error:", error);
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

      const result = await userService.verifyOtp(email, otp);
      res.status(result.status).json({ message: result.message });
    // } catch (error) {
    //   console.error("OTP verification error:", error);
    //   next(error);
    // }
  } catch (error: any) {
   // console.error("OTP verification error:", error);
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

      const result = await userService.resendOtp(email);
      res.status(result.status).json({ message: result.message });
    } catch (error: any) {
     // console.error("OTP resend error:", error);
     logger.error("OTP resend error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.loginUser(req.body);
      // res.status(STATUS_CODES.OK).json(result);
    // } catch (error) {
    //   next(error);
    // }
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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

      // res.status(STATUS_CODES.OK).json({
      //   message: result.message,
      //   user: result.user
      // });
      res.status(result.status).json({
  message: result.message,
  // user: {
  //   id: result.user._id,
  //   name: result.user.name,
  //   email: result.user.email,
  //   phone: result.user.phone,
  //   status: result.user.status,
  // },
   user: {
    id: result.id,
    name: result.name,
    email: result.email,
    phone: result.phone,
    // status: result.status,
     status: result.userStatus,
    isVerified: result.isVerified,
  },
  //token: result.token,
   accessToken: result.token,
   refreshToken: result.refreshToken,
});


  } catch (error: any) {
    //console.error("Login error:", error);
     logger.error("Login error: " + error.message);
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
  }
  
  
  // async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const user = req.user as any;
  //     if (!user) {
  //       res.status(STATUS_CODES.UNAUTHORIZED).json({
  //         error: MESSAGES.ERROR.UNAUTHORIZED,
  //       });
  //       return;
  //     }
  
  //     const result = await userService.processGoogleAuth(user);
  //   res.cookie("auth-token", result.token, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  //       path: "/",
  //     });
  
      
  //     //res.redirect(`${process.env.FRONTEND_URL}/auth-success`);
  //     res.status(result.status).json({
  //       message: result.message,
  //       user: {
  //         id: result.user._id,
  //         name: result.user.name,
  //         email: result.user.email,
  //       },
  //       token: result.token,
  //     });
  //   } catch (error: any) {
  //     console.error("Google auth error:", error);
  //     res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
  //       error: error.message || MESSAGES.ERROR.SERVER_ERROR,
  //     });
  //   }
  // }

  async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      if (!user) {
        res.redirect(`${process.env.FRONTEND_URL}/user/login?error=google_auth_failed`);
        return;
      }
  
      const result = await userService.processGoogleAuth(user);
      
      res.cookie("auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
        sameSite: "lax"
      });
  
      // Redirect to frontend with success
      res.redirect(`${process.env.FRONTEND_URL}/user/auth-success?token=${result.token}`);
      
    } catch (error: any) {
     // console.error("Google auth error:", error);
      logger.error("Google auth error: " + error.message);
      res.redirect(`${process.env.FRONTEND_URL}/user/login?error=google_auth_failed`);
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

      const result = await userService.forgotPassword(email);
      res.status(result.status).json({ 
        message: result.message 
      });
    } catch (error: any) {
      //console.error("Forgot password error:", error);
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

      const result = await userService.resetPassword(email, otp, newPassword);
      res.status(result.status).json({ 
        message: result.message 
      });
    } catch (error: any) {
      //console.error("Reset password error:", error);
       logger.error("Reset password error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  
  
}

export default new UserController();
