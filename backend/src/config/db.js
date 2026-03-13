// db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    // Connect to MongoDB using environment variable
    await mongoose.connect(process.env.MONGODB_URL);

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:");
    console.error(error.message); // Shows the real error
    process.exit(1); // Exit the process if DB fails to connect
  }
};