import { Request, Response, NextFunction } from "express";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import { container } from "../config/container";
import { TOKENS } from "../config/tokens";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";

export const checkUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).userId;
    const userType = (req as any).userType;

    if (userType === "user") {
      const userRepository = container.resolve<IUserRepository>(TOKENS.IUserRepository);
      const user = await userRepository.findById(userId);

      if (!user) {
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