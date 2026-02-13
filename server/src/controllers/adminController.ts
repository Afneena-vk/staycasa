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

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TOKENS.IAdminService) private _adminService: IAdminService
  ) {}

  private generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

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
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // res.clearCookie("admin-auth-token", { path: "/" });
      // res.clearCookie("admin-refresh-token", { path: "/" });

       const accessToken = req.cookies["access-token"];
          const refreshToken = req.cookies["refresh-token"];
          const userId = (req as any).userId;
          const userType = (req as any).userType;
      
         
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
    } catch (error: any) {
      logger.error("Logout error: " + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

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
    } catch (error: any) {
      console.error("Get users list error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async blockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "User ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }

      const result = await this._adminService.blockUser(userId);

      res.status(result.status).json({
        message: result.message,
        status: result.status,
      });
    } catch (error: any) {
      console.error("Block user error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async unblockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "User ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }

      const result = await this._adminService.unblockUser(userId);

      res.status(result.status).json({
        message: result.message,
        status: result.status,
      });
    } catch (error: any) {
      console.error("Unblock user error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "User ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }

      const result = await this._adminService.getUserById(userId);

      res.status(STATUS_CODES.OK).json(result);
    } catch (error: any) {
      console.error("Get user by ID error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getOwnersList(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      console.error("Get owners list error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async blockOwner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { ownerId } = req.params;

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
    } catch (error: any) {
      console.error("Block owner error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async unblockOwner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { ownerId } = req.params;

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
    } catch (error: any) {
      console.error("Unblock owner error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getOwnerById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { ownerId } = req.params;

      if (!ownerId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Owner ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }

      const result = await this._adminService.getOwnerById(ownerId);

      res.status(STATUS_CODES.OK).json(result);
    } catch (error: any) {
      console.error("Get owner by ID error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async approveOwner(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.params;
      if (!ownerId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Owner ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }
      const result = await this._adminService.approveOwner(ownerId);
      res.status(result.status).json(result);
    } catch (error: any) {
      console.error("Approve owner error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async rejectOwner(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.params;
      if (!ownerId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Owner ID is required",
          status: STATUS_CODES.BAD_REQUEST,
        });
        return;
      }
      const result = await this._adminService.rejectOwner(ownerId);
      res.status(result.status).json(result);
    } catch (error: any) {
      console.error("Reject owner error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }
  // async adminUserStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {

  //     const stats = await this._adminService.adminUserStatistics();

  //     res.status(STATUS_CODES.OK).json({
  //       status: STATUS_CODES.OK,
  //       data: stats, 
  //     });
  //   } catch (error:any) {
  //     console.error(error);

  //     res.status(500).json({
  //       status: 500,
  //       message: error.message || "Failed to fetch user statistics",
  //     });
  //   }
  // }

async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
    const dashboardData =
      await this._adminService.getAdminDashboardStats();

    res.status(200).json({
      status: 200,
      message: "Admin dashboard data fetched",
      data: dashboardData
    });
  } catch (error:unknown) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch admin dashboard data",
    });
  }
}

}

//export default new AdminController();
