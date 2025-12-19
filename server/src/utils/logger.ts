import { createLogger, format, transports } from "winston";
import path from "path";

const logDir = path.join(__dirname, "../logs");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    // new transports.File({ filename: "logs/error.log", level: "error" }),
    // new transports.File({ filename: "logs/combined.log" }),

    
    new transports.File({
      filename: path.join(logDir, "combined.log"),
      level: "info",
      maxsize: 5 * 1024 * 1024, 
      maxFiles: 5,               
    }),

     new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, 
      maxFiles: 5,               
    }),

  ],
});

export default logger;