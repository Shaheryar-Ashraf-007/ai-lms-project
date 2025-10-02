import User from "../models/User.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function Signup(req, res) {
  try {
    const { email, password, name, role, photoUrl } = req.body;

    // Input validation
    if (!name || !password || !email || !role) {
      return res.status(400).json({ message: "Please set credentials first" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be greater than 6 characters" });
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return res.status(400).json({ message: "Wrong email format" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
      photoUrl: photoUrl || null,
    });

    // Generate token
    let token;
    try {
      token = Jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({ message: "Token generation failed" });
    }

    // Set cookie
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Respond with user data
    res.status(201).json({ success: true, token, user: newUser });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    let token;
    try {
      token = Jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({ message: "Token generation failed" });
    }

    // Set cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Respond with token and user data
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  // Clear cookie
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}