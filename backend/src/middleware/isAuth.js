import Jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protectRoutes(req, res, next) {
  try {
    const token = req.cookies.token; 
    console.log("Token received:", token); // Log token

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    let verified;
    try {
      verified = Jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized - Token expired or invalid" });
    }

    req.userId = verified.userId; // Attach userId to the request

    const user = await User.findById(verified.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user; // Attach user object for further access if needed
    next(); // Call next middleware
  } catch (error) {
    console.error("Error in protect middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}