import { Request, Response, NextFunction } from "express";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import { container } from "../config/container";
import { TOKENS } from "../config/tokens";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { ITokenBlacklistRepository } from "../repositories/interfaces/ITokenBlacklistRepository";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

export const checkUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   
    const userId = req.userId;
    const userType = req.userType;

        if (!userId) {
           throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }

        if (!userType) {
           throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }

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

        res.clearCookie("access-token", { path: "/" });
        res.clearCookie("refresh-token", { path: "/" });
        res.clearCookie("csrf-token", { path: "/" });


            throw new AppError("User not found", STATUS_CODES.NOT_FOUND);
      }

      if (user.status === "blocked") {

        await blacklistTokens();

        res.clearCookie("access-token", { path: "/" });
        res.clearCookie("refresh-token", { path: "/" });
        res.clearCookie("csrf-token", { path: "/" });


         throw new AppError(
          "Your account has been blocked",
          STATUS_CODES.FORBIDDEN
        );
        
      }
    } else if (userType === "owner") {
      const ownerRepository = container.resolve<IOwnerRepository>(TOKENS.IOwnerRepository);
      const owner = await ownerRepository.findById(userId);

      if (!owner) {
         await blacklistTokens();

        res.clearCookie("access-token", { path: "/" });
        res.clearCookie("refresh-token", { path: "/" });
        res.clearCookie("csrf-token", { path: "/" });


         throw new AppError("Owner not found", STATUS_CODES.NOT_FOUND);
      }

      if (owner.isBlocked) {
         await blacklistTokens();

        res.clearCookie("access-token", { path: "/" });
        res.clearCookie("refresh-token", { path: "/" });
        res.clearCookie("csrf-token", { path: "/" });


        throw new AppError(
          "Your account has been blocked",
          STATUS_CODES.FORBIDDEN
        );
      }
    }

    next();

    } catch (error: unknown) {
    next(error);
  }
};