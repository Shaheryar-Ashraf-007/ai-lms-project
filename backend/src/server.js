import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();

const app = express();
app.use(express.json());

app.use(cookieParser());

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
))
const port = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
});
