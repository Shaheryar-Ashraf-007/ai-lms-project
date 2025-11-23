import User from "../models/User.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendMail from "../config/sendMail.js";

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
      return res
        .status(400)
        .json({ message: "Password must be greater than 6 characters" });
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
    res
      .status(201)
      .json({ success: true, user: { ...newUser._doc, password: undefined } });
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
      console.log("Generated Token:", token); // Consider if this log is necessary in production
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({ message: "Token generation failed" });
    }

    // Set cookie
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      httpOnly: true,
      sameSite: "Lax",
      secure: false, // Change to true in production
    });

    // Respond with user data and token
    res.status(200).json({
      success: true,
      token: token,
      user: { ...user._doc, password: undefined }, // Ensure the password is excluded
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export function logout(req, res) {
  // Clear cookie
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logout successful" });
}

export const sendOTP = async(req , res)=>{
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    res.status(200).json({success:true, message:"OTP sent successfully"});
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    user.resetOtpExpiry = otpExpiry;
    const isOtpVerified = false;
    await user.save();
    await sendMail(email , otp);
    return res.status(200).json({success:true, message:"OTP sent successfully"});
  } catch (error) {
    return res.status(500).json({message:"Internal server error"});
    
  }
}

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    // Check if the user exists and validate OTP and expiry
    if (!user || user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" }); // Change to 400 for bad request
    }

    // Mark OTP as verified
    user.resetOtp = undefined; // Clear the OTP after verification
    user.resetOtpExpiry = undefined; // Clear the expiry

    user.isOtpVerified = true; // Set OTP verification state
    await user.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Verified OTP error: ${error.message}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body; // Get email and newPassword
    console.log("Email:", email); // Log email
    console.log("New Password:", newPassword); // Log newPassword

    // Validate inputs
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required." });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(403).json({ message: "OTP verification is required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10); 
    user.password = hashedPassword;
    user.isOtpVerified = false; 
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error); 
    return res.status(500).json({ message: `Reset password error: ${error.message}` });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not found
      user = await User.create({ name, email, role });
    }

    let token;
    try {
      // Generate JWT token
      token = Jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("Generated Token:", token); // Log the token
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({ message: "Token generation failed" });
    }

    // Set cookie with the JWT token
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === 'production', // Secure in production
    });

    // Send success response with user data
    return res.status(200).json({
      message: "User authenticated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token, // Including the token in the response
    });
  } catch (error) {
    console.error("Error during Google authentication:", error);
    return res.status(500).json({ message: `Google auth error: ${error.message || error}` });
  }
};