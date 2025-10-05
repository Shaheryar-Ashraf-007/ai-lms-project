import { useDispatch, useSelector } from "react-redux";
import image from "../assets/image.png";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import axiosInstance from "../../lib/axiosInstance";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch()

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = async() => {
    try {

      const result = await axiosInstance.post("/auth/logout");
      dispatch(setUserData(null));
        localStorage.removeItem("token"); // Clear the token
      console.log("Logout response:", result.data); // Log the response data
      toast.success("logout successful");
        navigate("/login");


    } catch (error) {
      
      console.log("Logout clicked",error); 
      toast.error(error.response ? error.response.data.message : error.message);
      // Placeholder for logout action
    }
  };

  return (
    <nav className="w-full bg-[#2B3B6D] text-white pl-6 pb-2 pt-2 pr-6">
      <div className="flex flex-wrap items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={image}
            alt="Logo"
            className="w-16 h-16 max-w-full object-contain sm:w-12 sm:h-12 xs:w-10 xs:h-10"
          />
        </div>

        {/* Profile and Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
          {!userData ? (
            <CgProfile size={24} />
          ) : (
            <div className="w-12 h-12 rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-[#8A8A8A] border-white cursor-pointer">
              {userData.name && userData.name.length > 0 ? userData.name.slice(0, 1).toUpperCase() : ''}
            </div>
          )}

          {userData?.role === "educator" && (
            <button className="border border-[#FBB03B] px-2 py-2 rounded-md cursor-pointer ease-in-out hover:scale-105 transition-transform duration-300 text-sm sm:text-base">
              Dashboard
            </button>
          )}

          {!userData ? (
            <button
              onClick={handleLoginClick}
              className="bg-[#FBB03B] px-2 py-2 rounded-md cursor-pointer transition-transform ease-in-out hover:scale-105 duration-300 text-sm sm:text-base"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogoutClick}
              className="bg-[#FBB03B] px-2 py-2 rounded-md cursor-pointer transition-transform ease-in-out hover:scale-105 duration-300 text-sm sm:text-base"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;