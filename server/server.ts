
import 'reflect-metadata';
import dotenv from "dotenv";
import logger from "./src/utils/logger";
dotenv.config();

import app from "./src/app";

import connectDB from "./src/config/db";
import http from "http";
import { startBookingCompletionJob } from './src/jobs/bookingCompletion.job';

//const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();

    startBookingCompletionJob();

    const server = http.createServer(app); 

    
server.listen(PORT, () => { 
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
});



