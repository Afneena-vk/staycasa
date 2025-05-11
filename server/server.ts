

import dotenv from "dotenv";
dotenv.config();

import app from "./src/app";

import connectDB from "./src/config/db";
import http from "http";


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
await connectDB(); // Connect to the database
    const server = http.createServer(app); // Create HTTP server with Express app

    
server.listen(PORT, () => { 
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();
