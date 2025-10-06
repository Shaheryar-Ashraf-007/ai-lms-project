import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import axiosInstance from "../../lib/axiosInstance";

const GetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/user/current-user", {
          withCredentials: true,
        });
        dispatch(setUserData(response.data));
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchUser();
  }, [dispatch]);

  return null;
};

export default GetCurrentUser;
