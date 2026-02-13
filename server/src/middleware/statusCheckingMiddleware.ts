import { Request, Response, NextFunction } from "express";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import { container } from "../config/container";
import { TOKENS } from "../config/tokens";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { ITokenBlacklistRepository } from "../repositories/interfaces/ITokenBlacklistRepository";
import jwt from "jsonwebtoken";

export const checkUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).userId;
    const userType = (req as any).userType;
    const accessToken = req.cookies["access-token"];
    const refreshToken = req.cookies["refresh-token"];

    const tokenBlacklistRepo = container.resolve<ITokenBlacklistRepository>(
      TOKENS.ITokenBlacklistRepository
    );

    const blacklistTokens = async () => {
      if (accessToken) {
        const decoded = jwt.decode(accessToken) as { exp: number };
        await tokenBlacklistRepo.addToken(
          accessToken,
          'access',
          userId,
          userType,
          new Date(decoded.exp * 1000)
        );
      }
      if (refreshToken) {
        const decoded = jwt.decode(refreshToken) as { exp: number };
        await tokenBlacklistRepo.addToken(
          refreshToken,
          'refresh',
          userId,
          userType,
          new Date(decoded.exp * 1000)
        );
      }
    };

    if (userType === "user") {
      const userRepository = container.resolve<IUserRepository>(TOKENS.IUserRepository);
      const user = await userRepository.findById(userId);

      if (!user) {
         await blacklistTokens();
        // res.clearCookie("user-auth-token", { path: "/" });
        // res.clearCookie("user-refresh-token", { path: "/" });
        res.clearCookie("access-token", { path: "/" });
        res.clearCookie("refresh-token", { path: "/" });
        res.clearCookie("csrf-token", { path: "/" });

        res.status(STATUS_CODES.NOT_FOUND).json({
          error: "User not found",
        });
        return;
      }

      if (user.status === "blocked") {

        await blacklistTokens();
        // res.clearCookie("user-auth-token", { path: "/" });
        // res.clearCookie("user-refresh-token", { path: "/" });
        res.clearCookie("access-token", { path: "/" });
        res.clearCookie("refresh-token", { path: "/" });
        res.clearCookie("csrf-token", { path: "/" });

        res.status(STATUS_CODES.FORBIDDEN).json({
          error: "Your account has been blocked",
          blocked: true,
        });
        return;
      }
    } else if (userType === "owner") {
      const ownerRepository = container.resolve<IOwnerRepository>(TOKENS.IOwnerRepository);
      const owner = await ownerRepository.findById(userId);

      if (!owner) {
         await blacklistTokens();
        // res.clearCookie("owner-auth-token", { path: "/" });
        // res.clearCookie("owner-refresh-token", { path: "/" });
        res.clearCookie("access-token", { path: "/" });
        res.clearCookie("refresh-token", { path: "/" });
        res.clearCookie("csrf-token", { path: "/" });

        res.status(STATUS_CODES.NOT_FOUND).json({
          error: "Owner not found",
        });
        return;
      }

      if (owner.isBlocked) {
         await blacklistTokens();
        // res.clearCookie("owner-auth-token", { path: "/" });
        // res.clearCookie("owner-refresh-token", { path: "/" });
        res.clearCookie("access-token", { path: "/" });
        res.clearCookie("refresh-token", { path: "/" });
        res.clearCookie("csrf-token", { path: "/" });

        res.status(STATUS_CODES.FORBIDDEN).json({
          error: "Your account has been blocked",
          blocked: true,
        });
        return;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};