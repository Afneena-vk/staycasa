import { IUserController } from "./interfaces/IUserController";
import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";

class UserController implements IUserController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.registerUser(req.body); // result is { message: "..." }
      res.status(STATUS_CODES.CREATED).json({
        message: MESSAGES.SUCCESS.SIGNUP,
        details: result.message, // or just use message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
