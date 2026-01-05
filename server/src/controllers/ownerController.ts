import { injectable, inject } from "tsyringe";
import { IOwnerController } from "./interfaces/IOwnerController";
import { Request, Response, NextFunction } from "express";
//import ownerService from "../services/ownerService";
import { IOwnerService } from "../services/interfaces/IOwnerService";
import { TOKENS } from "../config/tokens";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import logger from "../utils/logger";
import crypto from 'crypto'

@injectable()
export class OwnerController implements IOwnerController {
  constructor(
    @inject(TOKENS.IOwnerService) private _ownerService: IOwnerService
  ) {}

    private generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this._ownerService.registerOwner(req.body);

      res.status(result.status).json({
        message: result.message,
      });
    } catch (error: any) {
      logger.error("Registartion failed", error);
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

      const result = await this._ownerService.verifyOtp(email, otp);
      res.status(result.status).json({ message: result.message });
    } catch (error: any) {
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

      const result = await this._ownerService.resendOtp(email);
      res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      //console.error("OTP resend error:", error);
      logger.error("OTP resend error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this._ownerService.loginOwner(req.body);
      const accessTokenMaxAge = Number(process.env.USER_ACCESS_TOKEN_MAX_AGE);
      const refreshTokenMaxAge = Number(process.env.USER_REFRESH_TOKEN_MAX_AGE);


          const csrfToken = this.generateCsrfToken();


        res.cookie("access-token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
       sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: accessTokenMaxAge,
      path: "/",
    });


         res.cookie("refresh-token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
       sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: refreshTokenMaxAge,
      path: "/",
    });

     res.cookie("csrf-token", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
       sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: refreshTokenMaxAge,
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
          approvalStatus: result.approvalStatus,
        },

        accessToken: result.token,
        refreshToken: result.refreshToken,
        csrfToken: csrfToken,
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

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // res.clearCookie("owner-auth-token", { path: "/" });
      // res.clearCookie("owner-refresh-token", { path: "/" });

    res.clearCookie("access-token", { path: "/" });
    res.clearCookie("refresh-token", { path: "/" });
    res.clearCookie("csrf-token", { path: "/" });

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

      const result = await this._ownerService.forgotPassword(email);
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

      const result = await this._ownerService.resetPassword(
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
      const ownerId = (req as any).userId;
      const result = await this._ownerService.getOwnerProfile(ownerId);

      res.status(result.status).json(result);
    } catch (error: any) {
      console.error("Get owner profile error:", error);
      logger.error("Get profile error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = (req as any).userId;
      const result = await this._ownerService.updateOwnerProfile(
        ownerId,
        req.body
      );

      res.status(result.status).json(result);
    } catch (error: any) {
      console.error("Update owner profile error:", error);
      logger.error("Update profile error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async uploadDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const ownerId = req.user?.userId;
      const ownerId = (req as any).userId;

      const file = req.file as Express.Multer.File;

      if (!file) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: MESSAGES.ERROR.NO_DOCUMENTS,
        });
        return;
      }

      const result = await this._ownerService.uploadDocument(ownerId, file);

      res.status(result.status).json({
        message: result.message,
        documents: result.document,
      });
    } catch (error: any) {
      console.error("Document upload error:", error);
      logger.error("Document upload error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = (req as any).userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ error: "All fields are required" });
        return;
      }

      const result = await this._ownerService.changePassword(
        ownerId,
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

  async getWallet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = (req as any).userId;
      const result = await this._ownerService.getWallet(ownerId);

      res.status(STATUS_CODES.OK).json(result);
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message,
      });
    }
  }
}

//export default new OwnerController();
