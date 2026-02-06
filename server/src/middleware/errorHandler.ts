import { Request, Response, NextFunction } from "express";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import logger from "../utils/logger";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  let statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
  let message = MESSAGES.ERROR.SERVER_ERROR;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
