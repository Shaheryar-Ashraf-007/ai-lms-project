import Jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protectRoutes(req, res, next) {
  try {
    // ✅ Read from Authorization header instead of cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // "Bearer eyJhbG..." → "eyJhbG..."

    console.log("Token received:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    let verified;
    try {
      verified = Jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized - Token expired or invalid" });
    }

    req.userId = verified.userId;

    const user = await User.findById(verified.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}