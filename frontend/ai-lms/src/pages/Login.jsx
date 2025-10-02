import { Link, Navigate } from "react-router-dom";
import image from "../assets/image.png";
import { useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { BsEye, BsGoogle } from "react-icons/bs";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      setLoading(false);
      setIsLoggedIn(true); // Set login status to true
      toast.success("Login successful!");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      toast.error("Login failed: Please check your credentials.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoggedIn) {
    return <Navigate to="/" />; 
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen py-8 px-4">
      <div className="flex flex-col lg:flex-row items-center justify-center max-w-6xl mx-auto">
        {/* Left part */}
        <div className="p-4 sm:p-6 md:p-8 w-full h-[600px] lg:w-1/2 bg-gray-200 rounded-lg lg:rounded-l-lg lg:rounded-r-none">
          <h1 className="text-center font-bold mt-4 text-xl sm:text-2xl">
            Welcome Back
          </h1>
          <p className="text-center text-gray-400 text-sm sm:text-base">
            Login to your account
          </p>

          {/* Email input */}
          <div className="flex sm:flex-row justify-between mt-4 gap-4 sm:gap-2">
            <div className="w-full sm:w-full">
              <div className="font-bold text-lg sm:text-xl mb-1">Email</div>
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FBB03B]"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="mt-4 font-bold text-lg sm:text-xl mb-1">Password</div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="**********"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FBB03B]"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <FiEyeOff size={20} /> : <BsEye size={20} />}
            </button>
          </div>

          {/* Login button */}
          <div className="flex items-center justify-center mt-6">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full sm:w-auto px-8 bg-[#FBB03B] py-2 rounded-lg text-white cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-[#FBB03B]"
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Login"}
            </button>
          </div>
          <div className="text-center text-md text-gray-400 mt-4 hover:text-[#FBB03B] cursor-pointer">
            Forgot Password?
          </div>

          <div className="text-gray-400 text-center mt-6 text-xs sm:text-sm flex items-center gap-2">
            <span className="flex-1 border-t border-gray-300"></span>
            <span>Or Continue With</span>
            <span className="flex-1 border-t border-gray-300"></span>
          </div>

          <div className="flex items-center justify-center mt-4">
            <button className="w-full sm:w-auto px-8 border border-[#FBB03B] py-2 rounded-lg hover:text-white cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-[#FBB03B]">
              <BsGoogle className="inline-block mr-2" /> Sign Up with Google
            </button>
          </div>

          <div className="text-gray-400 text-center mt-4 text-sm ">
            Already have an account?
            <Link
              to="/signup"
              className="text-[#FBB03B] font-bold hover:underline"
            >
              {" "}
              Sign Up
            </Link>
          </div>
        </div>

        {/* Image - Hidden on mobile, visible on large screens */}
        <div className="hidden lg:flex bg-[#2B3B6D] items-center justify-center rounded-r-lg w-1/3 min-h-[600px]">
          <img
            src={image}
            alt="logo"
            className="w-64 xl:w-96 h-64 xl:h-96 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;