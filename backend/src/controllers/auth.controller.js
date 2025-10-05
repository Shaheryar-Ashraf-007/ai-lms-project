import User from "../models/User.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Sign up a new user
export async function Signup(req, res) {
  try {
    console.log("JWT Secret:", process.env.JWT_SECRET); // Log the secret

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

    console.log("New User Created:", newUser); // Log the new user

    // Generate token
    let token;
    try {
      token = Jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("Generated Token:", token); // Log the token
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({ message: "Token generation failed" });
    }

    // Set cookie
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // Prevent client-side access to the cookie
      sameSite: "Lax", // Adjust for local testing
      secure: process.env.NODE_ENV === "production", // Set to true in production
    });

    // Respond with user data (omit password)
    res.status(201).json({ success: true, user: { ...newUser._doc, password: undefined } });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Log in an existing user
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
      console.log("Generated Token:", token); // Log the token
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({ message: "Token generation failed" });
    }

    // Set cookie
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // Prevent client-side access to the cookie
      sameSite: "Lax", // Adjust for local testing
      secure: process.env.NODE_ENV === "production", // Set to true in production
    });

    // Respond with user data (omit password)
    res.status(200).json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Log out a user
export function logout(req, res) {
  // Clear cookie
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logout successful" });
}