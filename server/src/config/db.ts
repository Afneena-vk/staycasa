


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/your-default-db';

const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    
    //console.log(`MongoDB Connected: ${connection.connection.host}`);
    logger.info(`MongoDB Connected: ${connection.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
     // console.error(`MongoDB connection error: ${err}`);
     logger.error(`Error connecting to MongoDB: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1); 
  }
};

export default connectDB;