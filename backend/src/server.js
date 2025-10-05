import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database before starting the server
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // Allow credentials (cookies) to be sent
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("JWT Secret:", process.env.JWT_SECRET); // Log JWT secret for debugging
});