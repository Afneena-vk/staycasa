import { IUserController } from "./interfaces/IUserController";
import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import jwt from "jsonwebtoken";

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
    console.error("Registration error:", error);
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
    console.error("OTP verification error:", error);
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
      console.error("OTP resend error:", error);
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
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        path: "/",
      });
      
      // res.status(STATUS_CODES.OK).json({
      //   message: result.message,
      //   user: result.user
      // });
      res.status(result.status).json({
  message: result.message,
  user: {
    id: result.user._id,
    name: result.user.name,
    email: result.user.email,
    phone: result.user.phone,
    status: result.user.status,
  },
  token: result.token,
});


  } catch (error: any) {
    console.error("Login error:", error);
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
  }
  
  
  async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      if (!user) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          error: MESSAGES.ERROR.UNAUTHORIZED,
        });
        return;
      }
  
      const result = await userService.processGoogleAuth(user);
    res.cookie("auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });
  
      
      //res.redirect(`${process.env.FRONTEND_URL}/auth-success`);
      res.status(result.status).json({
        message: result.message,
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
        },
        token: result.token,
      });
    } catch (error: any) {
      console.error("Google auth error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }



  // async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const { email } = req.body;

  //     if (!email) {
  //       res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Email is required" });
  //       return;
  //     }

  //     const result = await userService.forgotPassword(email);
  //     res.status(result.status).json({ message: result.message });
  //   } catch (error: any) {
  //     console.error("Forgot password error:", error);
  //     res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
  //       error: error.message || MESSAGES.ERROR.SERVER_ERROR,
  //     });
  //   }
  // }

  // async verifyResetOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const { email, otp } = req.body;

  //     if (!email || !otp) {
  //       res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Email and OTP are required" });
  //       return;
  //     }

  //     const result = await userService.verifyResetOtp(email, otp);
  //     res.status(result.status).json({ message: result.message });
  //   } catch (error: any) {
  //     console.error("Reset OTP verification error:", error);
  //     res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
  //       error: error.message || MESSAGES.ERROR.SERVER_ERROR,
  //     });
  //   }
  // }

  // async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const result = await userService.resetPassword(req.body);
  //     res.status(result.status).json({ message: result.message });
  //   } catch (error: any) {
  //     console.error("Reset password error:", error);
  //     res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
  //       error: error.message || MESSAGES.ERROR.SERVER_ERROR,
  //     });
  //   }
  // }


  
}

export default new UserController();
