import { IOwnerController } from "./interfaces/IOwnerController";
import { Request, Response, NextFunction } from "express";
import ownerService from "../services/ownerService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";

class OwnerController implements IOwnerController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ownerService.registerOwner(req.body); 
    //   res.status(STATUS_CODES.CREATED).json({
    //     message: MESSAGES.SUCCESS.SIGNUP,
    //     details: result.message, // or just use message: result.message
    //   });
    res.status(result.status).json({
        message: result.message,
      });
    // } catch (error) {
    //   next(error);
    // }
  } catch (error: any) {
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
  }
   async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { email, otp } = req.body;
  
        if (!email || !otp) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Email and OTP are required" });
          return;
        }
  
        const result = await ownerService.verifyOtp(email, otp);
        res.status(result.status).json({ message: result.message });
      // } catch (error) {
      //   next(error);
      // }
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }

  }

    async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { email } = req.body;
  
        if (!email) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Email is required" });
          return;
        }
  
        const result = await ownerService.resendOtp(email);
        res.status(result.status).json({ message: result.message });
      } catch (error: any) {
        console.error("OTP resend error:", error);
        res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error.message || MESSAGES.ERROR.SERVER_ERROR,
        });
      }
    }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ownerService.loginOwner(req.body);
      res.status(STATUS_CODES.OK).json(result);
    } catch (error: any) {
      console.error("Owner login error:", error);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }
}

export default new OwnerController();
