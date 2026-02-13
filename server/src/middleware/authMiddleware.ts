import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { container } from "../config/container";
import { TOKENS } from "../config/tokens";
import { ITokenBlacklistRepository } from "../repositories/interfaces/ITokenBlacklistRepository";

export const authMiddleware = (allowedRoles: string[]) => {
  return async(req: Request, res: Response, next: NextFunction) => {
    //const token = req.cookies["auth-token"];
    // let token: string | undefined;
    //  if (allowedRoles.includes("admin")) {
    //   token = req.cookies["admin-auth-token"];
    // } else if (allowedRoles.includes("owner")) {
    //   token = req.cookies["owner-auth-token"];  
    // } else if (allowedRoles.includes("user")) {
    //   token = req.cookies["user-auth-token"];
    // }

     const token = req.cookies["access-token"];
      //const token = req.cookies["access-token"] || req.headers["authorization"];

    if (!token) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.ERROR.UNAUTHORIZED });
      return;
    }

    try { 


      const tokenBlacklistRepo = container.resolve<ITokenBlacklistRepository>(
        TOKENS.ITokenBlacklistRepository
      );

          const isBlacklisted = await tokenBlacklistRepo.isBlacklisted(token);
      if (isBlacklisted) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: "token is blacklisted" });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
       // type: string;
        type: "user" | "admin" | "owner";
      };

      if (!allowedRoles.includes(decoded.type)) {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: MESSAGES.ERROR.FORBIDDEN });

        return;
      }

      (req as any).userId = decoded.userId;
      (req as any).userType = decoded.type;
      next();
    } catch (error) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.ERROR.INVALID_TOKEN });
      return;
    }
  };
};