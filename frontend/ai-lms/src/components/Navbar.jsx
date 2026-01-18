import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";
import { MenuIcon } from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import { setUserData } from "../redux/userSlice";
import Dropdown from "./Dropdown";
import SideModal from "./Modal";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleToggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleLogoutClick = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(setUserData(null));
      localStorage.removeItem("token");

      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again."
      );
      navigate("/");
    }
  };

  return (
    <nav className="w-full lg:h-20 h-15 bg-white text-white pl-6 lg:pt-2 pr-6">
      <div className="flex flex-wrap items-center justify-between">
        {/* Logo */}
        <div
          className="flex-shrink-0 cursor-pointer py-4 px-6 lg:px-12"
          onClick={() => navigate("/")}
        >
          <span className="text-[#FBB03B] text-2xl font-bold ">Skills Hive</span>
        </div>

        {/* Mobile menu icon */}
        <MenuIcon
          className="cursor-pointer lg:hidden text-[#FBB03B]"
          onClick={() => setShowSidebar((prev) => !prev)}
        />

        {/* Desktop navbar actions */}
        <div className="hidden lg:flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
          {/* Profile Icon */}
          {!userData ? (
            <CgProfile
              size={26}
              onClick={handleToggleDropdown}
              className="cursor-pointer"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-[#8A8A8A] cursor-pointer"
              onClick={handleToggleDropdown}
            >
              {userData?.name?.slice(0, 1).toUpperCase() || ""}
            </div>
          )}

          {/* Educator Dashboard Button */}
          {userData?.role === "educator" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#FBB03B] text-white px-3 py-2 rounded-md cursor-pointer hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
            >
              Dashboard
            </button>
          )}

          {/* Auth Buttons */}
          {!userData ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#FBB03B] text-[#FBB03B] px-3 py-2 rounded-md cursor-pointer hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogoutClick}
              className="border border-[#FBB03B] text-[#FBB03B] px-3 py-2 rounded-md cursor-pointer hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Dropdown for profile */}
      {showDropdown && (
        <div className="mt-2">
          <Dropdown
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
          />
        </div>
      )}

      {/* Sidebar for mobile */}
      <SideModal isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
    </nav>
  );
};

export default Navbar;
