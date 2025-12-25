import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

export const authMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //const token = req.cookies["auth-token"];
    // let token: string | undefined;
    //  if (allowedRoles.includes("admin")) {
    //   token = req.cookies["admin-auth-token"];
    // } else if (allowedRoles.includes("owner")) {
    //   token = req.cookies["owner-auth-token"];  
    // } else if (allowedRoles.includes("user")) {
    //   token = req.cookies["user-auth-token"];
    // }

     const token = req.cookies["access-token"];

    if (!token) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.ERROR.UNAUTHORIZED });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
       // type: string;
        type: "user" | "admin" | "owner";
      };

      if (!allowedRoles.includes(decoded.type)) {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: MESSAGES.ERROR.FORBIDDEN });

        return;
      }

      (req as any).userId = decoded.userId;
      (req as any).userType = decoded.type;
      next();
    } catch (error) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.ERROR.INVALID_TOKEN });
      return;
    }
  };
};