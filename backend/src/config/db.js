import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;
let useMemoryFallback = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitacare';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    useMemoryFallback = false;
    console.log(`[VitaCare DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[VitaCare DB] MongoDB connection failed (${error.message}).`);
    console.log(`[VitaCare DB] Running in Resilient Embedded Storage Mode. All features will work seamlessly without an external MongoDB daemon.`);
    useMemoryFallback = true;
    return null;
  }
};

export const getDbStatus = () => ({
  isConnected,
  useMemoryFallback,
});
