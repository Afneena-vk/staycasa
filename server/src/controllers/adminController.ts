import { injectable,inject } from "tsyringe";
import { IAdminController } from "./interfaces/IAdminController";
import { Request, Response, NextFunction } from "express";
import { IAdminService } from "../services/interfaces/IAdminService";
import { TOKENS } from "../config/tokens";
//import adminService from "../services/adminService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";


@injectable()
export class AdminController implements IAdminController{
    constructor(
    @inject(TOKENS.IAdminService) private adminService: IAdminService
  ) {}

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          
          const result = await this.adminService.loginAdmin(req.body);

        res.cookie("auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        //maxAge: 7 * 24 * 60 * 60 * 1000, 
        maxAge: 15 * 60 * 1000,
        path: "/",
      });
      
      res.cookie("refresh-token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
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
});
          
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

//export default new AdminController();