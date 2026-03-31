import { injectable, inject } from "tsyringe";
import { IOwnerController } from "./interfaces/IOwnerController";
import { Request, Response, NextFunction } from "express";
//import ownerService from "../services/ownerService";
import { IOwnerService } from "../services/interfaces/IOwnerService";
import { TOKENS } from "../config/tokens";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import logger from "../utils/logger";
import crypto from "crypto";
import { container } from "../config/container";
import { ITokenBlacklistRepository } from "../repositories/interfaces/ITokenBlacklistRepository";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

@injectable()
export class OwnerController implements IOwnerController {
  constructor(
    @inject(TOKENS.IOwnerService) private _ownerService: IOwnerService,
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
    } catch (error: unknown) {
      logger.error("Registration failed", error);
      next(error);
    }
  }
  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        throw new AppError(
          "Email and OTP are required",
          STATUS_CODES.BAD_REQUEST,
        );
      }

      const result = await this._ownerService.verifyOtp(email, otp);
      res.status(result.status).json({ message: result.message });
    } catch (error: unknown) {
      logger.error("OTP verification error", error);
      next(error);
    }
  }

  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError("Email is required", STATUS_CODES.BAD_REQUEST);
      }

      const result = await this._ownerService.resendOtp(email);
      res.status(result.status).json({ message: result.message });
    } catch (error: unknown) {
      logger.error("OTP resend error", error);
      next(error);
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
    } catch (error: unknown) {
      logger.error("Owner login error", error);
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // res.clearCookie("owner-auth-token", { path: "/" });
      // res.clearCookie("owner-refresh-token", { path: "/" });

      const accessToken = req.cookies["access-token"];
      const refreshToken = req.cookies["refresh-token"];

      const userId = req.userId;
      const userType = req.userType;

      if (!userId) {
        throw new AppError(
          MESSAGES.ERROR.UNAUTHORIZED,
          STATUS_CODES.UNAUTHORIZED,
        );
      }

      if (!userType) {
        throw new AppError(
          MESSAGES.ERROR.UNAUTHORIZED,
          STATUS_CODES.UNAUTHORIZED,
        );
      }

      const tokenBlacklistRepo = container.resolve<ITokenBlacklistRepository>(
        TOKENS.ITokenBlacklistRepository,
      );

      if (accessToken) {
        const decoded = jwt.decode(accessToken) as { exp: number };
        await tokenBlacklistRepo.addToken(
          accessToken,
          "access",
          userId,
          userType,
          new Date(decoded.exp * 1000),
        );
      }

      if (refreshToken) {
        const decoded = jwt.decode(refreshToken) as { exp: number };
        await tokenBlacklistRepo.addToken(
          refreshToken,
          "refresh",
          userId,
          userType,
          new Date(decoded.exp * 1000),
        );
      }

      res.clearCookie("access-token", { path: "/" });
      res.clearCookie("refresh-token", { path: "/" });
      res.clearCookie("csrf-token", { path: "/" });

      res
        .status(STATUS_CODES.OK)
        .json({ message: MESSAGES.SUCCESS.LOGOUT || "Logout successful" });
    } catch (error: unknown) {
      logger.error("Logout error", error);
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError("Email is required", STATUS_CODES.BAD_REQUEST);
      }

      const result = await this._ownerService.forgotPassword(email);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error: unknown) {
      logger.error("Forgot password error", error);
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, otp, newPassword, confirmPassword } = req.body;

      if (!email || !otp || !newPassword || !confirmPassword) {
        throw new AppError("All fields are required", STATUS_CODES.BAD_REQUEST);
      }

      if (newPassword !== confirmPassword) {
        throw new AppError(
          MESSAGES.ERROR.PASSWORD_MISMATCH,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      const result = await this._ownerService.resetPassword(
        email,
        otp,
        newPassword,
      );
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error: unknown) {
      logger.error("Reset password error", error);
      next(error);
    }
  }

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const ownerId = req.userId;

      if (!ownerId) {
        throw new AppError(
          MESSAGES.ERROR.UNAUTHORIZED,
          STATUS_CODES.UNAUTHORIZED,
        );
      }
      const result = await this._ownerService.getOwnerProfile(ownerId);

      res.status(result.status).json(result);
    } catch (error: unknown) {
      logger.error("Get owner profile error", error);
      next(error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // const ownerId = (req as any).userId;
      const ownerId = req.userId;

      if (!ownerId) {
        throw new AppError(
          MESSAGES.ERROR.UNAUTHORIZED,
          STATUS_CODES.UNAUTHORIZED,
        );
      }
      const result = await this._ownerService.updateOwnerProfile(
        ownerId,
        req.body,
      );

      res.status(result.status).json(result);
    } catch (error: unknown) {
      logger.error("Update profile error", error);
      next(error);
    }
  }

  async uploadDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const ownerId = req.userId;

      if (!ownerId) {
        throw new AppError(
          MESSAGES.ERROR.UNAUTHORIZED,
          STATUS_CODES.UNAUTHORIZED,
        );
      }

      const file = req.file as Express.Multer.File;

      if (!file) {
        throw new AppError(
          MESSAGES.ERROR.NO_DOCUMENTS,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      const result = await this._ownerService.uploadDocument(ownerId, file);

      res.status(result.status).json({
        message: result.message,
        documents: result.document,
      });
    } catch (error: unknown) {
      logger.error("Document upload error", error);
      next(error);
    }
  }

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const ownerId = req.userId;
      const { currentPassword, newPassword } = req.body;

      if (!ownerId) {
        throw new AppError(
          MESSAGES.ERROR.UNAUTHORIZED,
          STATUS_CODES.UNAUTHORIZED,
        );
      }

      if (!currentPassword || !newPassword) {
        throw new AppError("All fields are required", STATUS_CODES.BAD_REQUEST);
      }

      const result = await this._ownerService.changePassword(
        ownerId,
        currentPassword,
        newPassword,
      );

      res.status(result.status).json(result);
    } catch (error: unknown) {
      logger.error("Change password error", error);
      next(error);
    }
  }

  async getWallet(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const ownerId = req.userId;

      if (!ownerId) {
        throw new AppError(
          MESSAGES.ERROR.UNAUTHORIZED,
          STATUS_CODES.UNAUTHORIZED,
        );
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this._ownerService.getWallet(ownerId, page, limit);
      // const result = await this._ownerService.getWallet(ownerId);

      res.status(STATUS_CODES.OK).json(result);
    } catch (error: unknown) {
      next(error);
    }
  }
}

//export default new OwnerController();
