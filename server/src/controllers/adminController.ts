import { IAdminController } from "./interfaces/IAdminController";
import { Request, Response, NextFunction } from "express";
import adminService from "../services/adminService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";

class AdminController implements IAdminController{
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          
          const result = await adminService.loginAdmin(req.body);
          res.status(STATUS_CODES.OK).json(result);
        // } catch (error) {
        //   next(error);
        // }
      } catch (error: any) {
        console.error("Login error:", error);
        res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        });
      }
      }
}

export default new AdminController();