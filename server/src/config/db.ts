
// import mongoose from 'mongoose';

// const connectDB = async (): Promise<void> => {
//   try {
//     const conn = await mongoose.connect(process.env.DATABASE_URL || '');
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/your-default-db';

const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;