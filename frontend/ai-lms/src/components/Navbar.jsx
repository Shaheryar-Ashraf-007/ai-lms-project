import { useDispatch, useSelector } from "react-redux";
import image from "../assets/image.png";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import axiosInstance from "../../lib/axiosInstance";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { MenuIcon } from "lucide-react";
import SideModal from "./Modal";

const Navbar = () => {
  const { userData } = useSelector((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // State for the sidebar
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Load user from localStorage when the app reloads
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user && !userData) {
      dispatch(setUserData(JSON.parse(user)));
    }
  }, [dispatch, userData]);

  // Logout button click
  const handleLogoutClick = async () => {
    try {
      await axiosInstance.post("/auth/logout");

      // Clear user and token
      dispatch(setUserData(null));
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <nav className="w-full h-20 bg-[#2B3B6D] text-white pl-6 pb-2 pt-2 pr-6">
      <div className="flex flex-wrap items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={image}
            alt="Logo"
            className="w-16 h-16 max-w-full object-contain sm:w-12 sm:h-12 xs:w-10 xs:h-10"
          />
        </div>

        <MenuIcon
          className="cursor-pointer lg:hidden"
          onClick={() => setShowSidebar((prev) => !prev)}
        />

        {/* Profile + Buttons */}
        <div className="lg:flex lg:flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0 hidden">
          {!userData ? (
            <CgProfile
              size={24}
              onClick={handleToggleDropdown}
              className="cursor-pointer"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-[#8A8A8A] border-white cursor-pointer"
              onClick={handleToggleDropdown}
            >
              {userData?.name?.slice(0, 1).toUpperCase() || ""}
            </div>
          )}

          {userData?.role === "educator" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#FBB03B] px-2 py-2 rounded-md cursor-pointer ease-in-out hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
            >
              Dashboard
            </button>
          )}

          {!userData ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#FBB03B] px-2 py-2 rounded-md cursor-pointer transition-transform ease-in-out hover:scale-105 duration-300 text-sm sm:text-base"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogoutClick}
              className="border border-[#FBB03B] px-2 py-2 rounded-md cursor-pointer transition-transform ease-in-out hover:scale-105 duration-300 text-sm sm:text-base"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {showDropdown && (
        <div className="mt-2">
          <Dropdown
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
          />
        </div>
      )}

      <SideModal isOpen={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* <Modal isOpen={showSidebar} onClose={() => setShowSidebar(false)} /> */}
    </nav>
  );
};

export default Navbar;
