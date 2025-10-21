import { IAuthController } from "./interfaces/IAuthController";
import { Request, Response, NextFunction } from "express";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

 class AuthController implements IAuthController{
    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
         try {
    const refreshToken = req.cookies["user-refresh-token"] || 
                        req.cookies["owner-refresh-token"] || 
                        req.cookies["admin-refresh-token"] ||
                        req.body.refreshToken;

    if (!refreshToken) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ 
        message: MESSAGES.ERROR.UNAUTHORIZED 
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

    
    res.cookie(`${decoded.type}-auth-token`, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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