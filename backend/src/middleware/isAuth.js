import Jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protectRoutes(req, res, next) {
  try {
    const token = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decode = Jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "message: Unauthorized - User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("error in protect middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
