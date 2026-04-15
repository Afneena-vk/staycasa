import { injectable, inject } from "tsyringe";
import { IAdminController } from "./interfaces/IAdminController";
import { Request, Response, NextFunction } from "express";
import { IAdminService } from "../services/interfaces/IAdminService";
import { TOKENS } from "../config/tokens";
import { container } from "../config/container";
import jwt from "jsonwebtoken";
import { ITokenBlacklistRepository } from "../repositories/interfaces/ITokenBlacklistRepository";
//import adminService from "../services/adminService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import {
  UserListQueryDto,
  UserDetailResponseDto,
  OwnerListQueryDto,
} from "../dtos/admin.dto";
import logger from "../utils/logger";
import crypto from "crypto"
import { AppError } from "../utils/AppError";
import { parseParam } from "../utils/parseParam";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TOKENS.IAdminService) private _adminService: IAdminService
  ) {}

  private generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

  async getUsersList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const queryParams: UserListQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: req.query.search as string,
        status: req.query.status as "active" | "blocked" | "all",
        sortBy: req.query.sortBy as "name" | "email" | "createdAt",
        sortOrder: req.query.sortOrder as "asc" | "desc",
      };

      const result = await this._adminService.getUsersList(queryParams);

      res.status(STATUS_CODES.OK).json(result);

  } catch (error: unknown) {
    next(error);
  }
  }

  async blockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { userId } = req.params;
      const userId = req.params.userId;

      if (!userId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "User ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }

       const id = Array.isArray(userId) ? userId[0] : userId;

      // const result = await this._adminService.blockUser(userId);
        const result = await this._adminService.blockUser(id);

      res.status(result.status).json({
        message: result.message,
        status: result.status,
      });

     } catch (error: unknown) {
  next(error);
}
  }

  async unblockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { userId } = req.params;
      const userId = req.params.userId;

      if (!userId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "User ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }

      const id = Array.isArray(userId) ? userId[0] : userId;

      //const result = await this._adminService.unblockUser(userId);

      const result = await this._adminService.unblockUser(id);

      res.status(result.status).json({
        message: result.message,
        status: result.status,
      });

      } catch (error: unknown) {
    next(error);
  }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { userId } = req.params;
      const userId = parseParam(req.params.userId);

      if (!userId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "User ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }

      const result = await this._adminService.getUserById(userId);

      res.status(STATUS_CODES.OK).json(result);

      } catch (error: unknown) {
    next(error);
  }
  }

  async getOwnersList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams: OwnerListQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: req.query.search as string,
        status: req.query.status as "active" | "blocked" | "all",
        sortBy: req.query.sortBy as "name" | "email" | "createdAt",
        sortOrder: req.query.sortOrder as "asc" | "desc",
      };

      const result = await this._adminService.getOwnersList(queryParams);
      res.status(STATUS_CODES.OK).json(result);

      } catch (error: unknown) {
    next(error);
  }
  }

  async blockOwner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { ownerId } = req.params;
      const ownerId = parseParam(req.params.ownerId);

      if (!ownerId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Owner ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }

      const result = await this._adminService.blockOwner(ownerId);

      res.status(result.status).json({
        message: result.message,
        status: result.status,
      });
 
      } catch (error: unknown) {
    next(error);
  }
  }

  async unblockOwner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { ownerId } = req.params;
      const ownerId = parseParam(req.params.ownerId);

      if (!ownerId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Owner ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }

      const result = await this._adminService.unblockOwner(ownerId);

      res.status(result.status).json({
        message: result.message,
        status: result.status,
      });
 
      } catch (error: unknown) {
    next(error);
  }
  }

  async getOwnerById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { ownerId } = req.params;
      const ownerId = parseParam(req.params.ownerId);

      if (!ownerId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Owner ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }

      const result = await this._adminService.getOwnerById(ownerId);

      res.status(STATUS_CODES.OK).json(result);
  
      } catch (error: unknown) {
    next(error);
  }
  }

  async approveOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const { ownerId } = req.params;
      const ownerId = parseParam(req.params.ownerId);
      if (!ownerId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Owner ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }
      const result = await this._adminService.approveOwner(ownerId);
      res.status(result.status).json(result);
    
      } catch (error: unknown) {
    next(error);
  }
  }

  async rejectOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const { ownerId } = req.params;
      const ownerId = parseParam(req.params.ownerId);
      if (!ownerId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Owner ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }
      const result = await this._adminService.rejectOwner(ownerId);
      res.status(result.status).json(result);
    
      } catch (error: unknown) {
    next(error);
  }
  }


async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
    const dashboardData =
      await this._adminService.getAdminDashboardStats();

    res.status(200).json({
      status: 200,
      message: "Admin dashboard data fetched",
      data: dashboardData
    });
  
    } catch (error: unknown) {
    next(error);
  }
}



  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this._adminService.loginAdmin(req.body);
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

      //res.status(STATUS_CODES.OK).json(result);

      res.status(result.status).json({
        message: result.message,

        user: {
          id: result.id,
          name: result.name,
          email: result.email,
        },

        accessToken: result.token,
        refreshToken: result.refreshToken,
        csrfToken: csrfToken,
      });
    
      } catch (error: unknown) {
    next(error);
  }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // res.clearCookie("admin-auth-token", { path: "/" });
      // res.clearCookie("admin-refresh-token", { path: "/" });

       const accessToken = req.cookies["access-token"];
          const refreshToken = req.cookies["refresh-token"];
       

          const userId = req.userId;
          const userType = req.userType;
      
         if (!userId || !userType) {
  throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
}

          const tokenBlacklistRepo = container.resolve<ITokenBlacklistRepository>(
            TOKENS.ITokenBlacklistRepository
          );
      
          
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

    res.clearCookie("access-token", { path: "/" });
    res.clearCookie("refresh-token", { path: "/" });
    res.clearCookie("csrf-token", { path: "/" });


      res
        .status(STATUS_CODES.OK)
        .json({ message: MESSAGES.SUCCESS.LOGOUT || "Logout successful" });
 
      } catch (error: unknown) {
    next(error);
  }
  }




}

//export default new AdminController();
