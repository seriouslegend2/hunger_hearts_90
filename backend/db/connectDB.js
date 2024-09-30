import 'dotenv/config';
import mongoose from "mongoose";

const url = process.env.MONGO_URL || "mongodb://0.0.0.0:27017/SEVaa";

export async function connectDB(){
    try {
      await mongoose.connect(url);
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    }
  };
  