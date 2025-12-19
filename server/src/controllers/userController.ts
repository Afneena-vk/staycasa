import { injectable, inject } from "tsyringe";
import { IUserController } from "./interfaces/IUserController";
import { Request, Response, NextFunction } from "express";
import { IUserService } from "../services/interfaces/IUserService";
import { TOKENS } from "../config/tokens";
//import userService from "../services/userService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TOKENS.IUserService) private _userService: IUserService
  ) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this._userService.registerUser(req.body);

     res.status(result.status).json({
        message: result.message,
      });
    } catch (error: any) {
      //console.error("Registration error:", error);
      logger.error("Registration error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: "Email and OTP are required" });
        return;
      }

      const result = await this._userService.verifyOtp(email, otp);
      res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      // console.error("OTP verification error:", error);
      logger.error("OTP verification error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ error: "Email is required" });
        return;
      }

      const result = await this._userService.resendOtp(email);
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
      const result = await this._userService.loginUser(req.body);

      const accessTokenMaxAge = Number(process.env.USER_ACCESS_TOKEN_MAX_AGE);
      const refreshTokenMaxAge = Number(process.env.USER_REFRESH_TOKEN_MAX_AGE);

      res.cookie("user-auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        //maxAge: 7 * 24 * 60 * 60 * 1000,
        // maxAge: 15 * 60 * 1000,
        maxAge: accessTokenMaxAge,
        path: "/",
      });

      res.cookie("user-refresh-token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // maxAge: 7 * 24 * 60 * 60 * 1000,
        maxAge: refreshTokenMaxAge,
        path: "/",
      });

      res.status(result.status).json({
        message: result.message,

        user: {
          id: result.id,
          name: result.name,
          email: result.email,
          phone: result.phone,
          status: result.userStatus,
          isVerified: result.isVerified,
        },

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

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("user-auth-token", { path: "/" });
      res.clearCookie("user-refresh-token", { path: "/" });

      res
        .status(STATUS_CODES.OK)
        .json({ message: MESSAGES.SUCCESS.LOGOUT || "Logout successful" });
    } catch (error: any) {
      logger.error("Logout error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async googleCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as any;
      if (!user) {
        res.redirect(
          `${process.env.FRONTEND_URL}/user/login?error=google_auth_failed`
        );
        return;
      }

      const result = await this._userService.processGoogleAuth(user);

      res.cookie("user-auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        path: "/",
        sameSite: "lax",
      });
      res.cookie("user-refresh-token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        sameSite: "lax",
      });

      res.redirect(`${process.env.FRONTEND_URL}/user/auth-success`);
    } catch (error: any) {
      logger.error("Google auth error: " + error.message);
      res.redirect(
        `${process.env.FRONTEND_URL}/user/login?error=google_auth_failed`
      );
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Email is required",
        });
        return;
      }

      const result = await this._userService.forgotPassword(email);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error: any) {
      logger.error("Forgot password error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp, newPassword, confirmPassword } = req.body;

      if (!email || !otp || !newPassword || !confirmPassword) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "All fields are required",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: MESSAGES.ERROR.PASSWORD_MISMATCH,
        });
        return;
      }

      const result = await this._userService.resetPassword(
        email,
        otp,
        newPassword
      );
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error: any) {
      logger.error("Reset password error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).userId;
      const result = await this._userService.getUserProfile(userId);

      res.status(result.status).json(result);
    } catch (error: any) {
      console.error("Get user profile error:", error);
      logger.error("Get user profile error: " + error.message);

      res
        .status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || MESSAGES.ERROR.SERVER_ERROR });
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).userId;
      const result = await this._userService.updateUserProfile(
        userId,
        req.body
      );

      res.status(result.status).json(result);
    } catch (error: any) {
      console.error("Update user profile error:", error);
      logger.error("Update user profile error: " + error.message);

      res
        .status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || MESSAGES.ERROR.SERVER_ERROR });
    }
  }

  async uploadProfileImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).userId;

      if (!req.file) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ error: "No file uploaded" });
        return;
      }

      const imageUrl = (req.file as any).path;

      const result = await this._userService.updateUserProfileImage(
        userId,
        imageUrl
      );

      res.status(result.status).json(result);
    } catch (error: any) {
      console.error("Upload profile image error:", error);
      res
        .status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || MESSAGES.ERROR.SERVER_ERROR });
    }
  }
  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ error: "All fields are required" });
        return;
      }

      const result = await this._userService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      res.status(result.status).json(result);
    } catch (error: any) {
      logger.error("Change password error: " + error.message);
      res
        .status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || "Server error" });
    }
  }
}

//export default new UserController();
