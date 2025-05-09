import { IOwnerController } from "./interfaces/IOwnerController";
import { Request, Response, NextFunction } from "express";
import ownerService from "../services/ownerService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";

class OwnerController implements IOwnerController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ownerService.registerOwner(req.body); // result is { message: "..." }
    //   res.status(STATUS_CODES.CREATED).json({
    //     message: MESSAGES.SUCCESS.SIGNUP,
    //     details: result.message, // or just use message: result.message
    //   });
    res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      next(error);
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
      } catch (error) {
        next(error);
      }
    }
}

export default new OwnerController();
