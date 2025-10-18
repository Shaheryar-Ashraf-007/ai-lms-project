import { Link, useNavigate } from "react-router-dom";
import image from "../assets/image.png";
import { useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { BsEye, BsGoogle } from "react-icons/bs";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
        role,
      }, { withCredentials: true });

      dispatch(setUserData(response.data)); 
      
      console.log("Response Data:", response.data); 

      toast.success("Signup successful!");
      navigate("/"); 
    } catch (error) {
      console.error("Signup failed:", error.response ? error.response.data : error.message);
      toast.error(`Signup failed: ${error.response ? error.response.data.message : error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Section - Form */}
            <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-10 xl:p-12">
              {/* Header */}
              <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Let's Get Started
                </h1>
                <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
                  Create your account to begin
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-5 lg:space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 cursor-pointer"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <BsEye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    I am a
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer ${
                        role === "student"
                          ? "bg-gradient-to-r from-[#FBB03B] to-[#f5a732] text-white shadow-lg"
                          : "bg-white border-2 border-gray-300 text-gray-700 hover:border-[#FBB03B] hover:text-[#FBB03B]"
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("educator")}
                      className={`py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer ${
                        role === "educator"
                          ? "bg-gradient-to-r from-[#FBB03B] to-[#f5a732] text-white shadow-lg"
                          : "bg-white border-2 border-gray-300 text-gray-700 hover:border-[#FBB03B] hover:text-[#FBB03B]"
                      }`}
                    >
                      Educator
                    </button>
                  </div>
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#FBB03B] to-[#f5a732] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center cursor-pointer"
                >
                  {loading ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6 lg:my-8">
                <span className="flex-1 border-t border-gray-300"></span>
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Or continue with</span>
                <span className="flex-1 border-t border-gray-300"></span>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <BsGoogle size={20} />
                <span>Sign up with Google</span>
              </button>

              {/* Login Redirect */}
              <p className="text-center text-gray-600 mt-6 lg:mt-8 text-sm sm:text-base">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#FBB03B] font-semibold hover:text-[#e9a035] transition-colors duration-200 cursor-pointer"
                >
                  Log In
                </Link>
              </p>
            </div>

            {/* Right Section - Image */}
            <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#2B3B6D] to-[#1a2744] items-center justify-center p-8 xl:p-12 relative overflow-hidden min-h-[500px]">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBB03B] rounded-full opacity-10 -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FBB03B] rounded-full opacity-10 -ml-24 -mb-24"></div>
              
              <div className="relative z-10 flex items-center justify-center">
                <img
                  src={image}
                  alt="signup visual"
                  className="w-full max-w-sm xl:max-w-md h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Image (shown on small screens) */}
        <div className="lg:hidden mt-8 flex justify-center pb-6">
          <img
            src={image}
            alt="signup visual"
            className="w-48 sm:w-64 h-auto object-contain opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;