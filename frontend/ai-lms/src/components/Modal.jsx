import React, { useEffect } from "react";
import { Home, User, LayoutDashboard, LogOut, X, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { clearUserData, setUserData } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { BiLogoDiscourse } from "react-icons/bi";

const SideModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (token && user && !userData) {
      try {
        const parsedUser = user;
        dispatch(setUserData(parsedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [token, user, userData, dispatch]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Hide modal if not open
  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(clearUserData());
    onClose();
    navigate("/login");
  };

  return (
    <>
      {/* Dark Overlay with blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      {/* Side Modal */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 sm:w-80 bg-gradient-to-b from-gray-50 via-white to-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with enhanced gradient */}
        <div className="bg-gradient-to-br from-[#FBB03B] via-[#f5a732] to-[#e89f2f] p-6 relative shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/30 rounded-full p-2 transition-all duration-200 hover:rotate-90"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center ring-4 ring-white/20">
                <User className="text-white" size={28} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="text-white font-bold text-lg tracking-wide">
                {userData?.name || "John Doe"}
              </p>
              <p className="text-white/90 text-sm font-medium capitalize bg-white/20 px-3 py-1 rounded-full inline-block mt-1">
                {userData?.role || "Student"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items with enhanced background */}
        <div className="p-5 flex flex-col min-h-[calc(100%-140px)] bg-gradient-to-b from-white to-gray-50">
          <div className="flex-1 space-y-2">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center justify-between gap-4 hover:bg-gradient-to-r hover:from-[#FBB03B] hover:to-[#f5a732] bg-white hover:shadow-md p-4 rounded-xl cursor-pointer transition-all duration-200 group text-gray-700 hover:text-white border border-gray-100 hover:border-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-200">
                  <Home
                    className="group-hover:text-white text-gray-600 transition-colors duration-200"
                    size={20}
                  />
                </div>
                <span className="font-semibold text-base">Home</span>
              </div>
              <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={18} />
            </Link>

            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center justify-between gap-4 hover:bg-gradient-to-r hover:from-[#FBB03B] hover:to-[#f5a732] bg-white hover:shadow-md p-4 rounded-xl cursor-pointer transition-all duration-200 group text-gray-700 hover:text-white border border-gray-100 hover:border-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-200">
                  <User
                    className="group-hover:text-white text-gray-600 transition-colors duration-200"
                    size={20}
                  />
                </div>
                <span className="font-semibold text-base">Profile</span>
              </div>
              <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={18} />
            </Link>

            <Link
              to="/myCourses"
              onClick={onClose}
              className="flex items-center justify-between gap-4 hover:bg-gradient-to-r hover:from-[#FBB03B] hover:to-[#f5a732] bg-white hover:shadow-md p-4 rounded-xl cursor-pointer transition-all duration-200 group text-gray-700 hover:text-white border border-gray-100 hover:border-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-200">
                  <BiLogoDiscourse
                    className="group-hover:text-white text-gray-600 transition-colors duration-200"
                    size={20}
                  />
                </div>
                <span className="font-semibold text-base">My Courses</span>
              </div>
              <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={18} />
            </Link>

            {userData?.role && (
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex items-center justify-between gap-4 hover:bg-gradient-to-r hover:from-[#FBB03B] hover:to-[#f5a732] bg-white hover:shadow-md p-4 rounded-xl cursor-pointer transition-all duration-200 group text-gray-700 hover:text-white border border-gray-100 hover:border-transparent"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-200">
                    <LayoutDashboard
                      className="group-hover:text-white text-gray-600 transition-colors duration-200"
                      size={20}
                    />
                  </div>
                  <span className="font-semibold text-base">Dashboard</span>
                </div>
                <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={18} />
              </Link>
            )}
          </div>

          {/* Logout Button with enhanced styling */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between gap-4 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 bg-white hover:shadow-md p-4 rounded-xl cursor-pointer transition-all duration-200 group text-gray-700 hover:text-white border border-gray-100 hover:border-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-200">
                  <LogOut
                    className="group-hover:text-white text-red-500 transition-colors duration-200"
                    size={20}
                  />
                </div>
                <span className="font-semibold text-base group-hover:text-white text-red-500">
                  Logout
                </span>
              </div>
              <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:text-white transition-opacity duration-200" size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideModal;