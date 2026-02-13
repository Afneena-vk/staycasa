import { IAuthController } from "./interfaces/IAuthController";
import { Request, Response, NextFunction } from "express";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import crypto from "crypto";
import { TOKENS } from "../config/tokens";
import { container } from "../config/container";
import { ITokenBlacklistRepository } from "../repositories/interfaces/ITokenBlacklistRepository";

 class AuthController implements IAuthController{
    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
         try {
    // const refreshToken = req.cookies["user-refresh-token"] || 
    //                     req.cookies["owner-refresh-token"] || 
    //                     req.cookies["admin-refresh-token"] ||
    //                     req.body.refreshToken;
      const refreshToken = req.cookies["refresh-token"];
      const csrfToken = req.headers["x-csrf-token"] as string;
      const storedCsrfToken = req.cookies["csrf-token"];



    if (!refreshToken) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ 
        message: MESSAGES.ERROR.UNAUTHORIZED 
      });
      return;
    }

   
    const tokenBlacklistRepo = container.resolve<ITokenBlacklistRepository>(
      TOKENS.ITokenBlacklistRepository
    );
    
    const isBlacklisted = await tokenBlacklistRepo.isBlacklisted(refreshToken);
    if (isBlacklisted) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        message: MESSAGES.ERROR.INVALID_TOKEN
      });
      return;
    }

     if (!csrfToken || !storedCsrfToken || csrfToken !== storedCsrfToken) {
        res.status(STATUS_CODES.FORBIDDEN).json({
          message: "Invalid CSRF token"
        });
        return;
      }

    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    if (!JWT_REFRESH_SECRET) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }

    
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      userId: string;
      email: string;
      type: "user" | "owner" | "admin";
    };

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }

   
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, type: decoded.type },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    


      res.cookie("access-token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // sameSite: "strict",
         sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 15 * 60 * 1000,
        path: "/",
      });

    res.status(STATUS_CODES.OK).json({
      accessToken: newAccessToken,
      message: "Token refreshed successfully"
    });

  } catch (error: any) {
    logger.error("Refresh token error: " + error.message);
    res.status(STATUS_CODES.UNAUTHORIZED).json({
      message: MESSAGES.ERROR.INVALID_TOKEN
    });
  }
    }
}

export default new AuthController();