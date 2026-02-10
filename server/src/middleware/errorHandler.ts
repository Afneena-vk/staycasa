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
//   logger.error(err);
  console.error(" ERROR CAUGHT:");
  console.error(err);              
  console.error(err?.message);     
  console.error(err?.stack);       

  logger.error({
    message: err?.message,
    stack: err?.stack,
    error: err,
  });

  let statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
  let message = MESSAGES.ERROR.SERVER_ERROR;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err?.statusCode) {
  statusCode = err.statusCode;
  message = err?.error?.description || err.message;
} else if (err?.message) {
  message = err.message;
}

  res.status(statusCode).json({
    success: false,
    message,
  });
};
