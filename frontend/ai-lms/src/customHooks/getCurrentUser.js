import axios from "axios";
import { setUserData } from "../redux/userSlice";

const GetCurrentUser = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get("/api/current-user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data) {
      dispatch(setUserData(res.data));
      localStorage.setItem("userData", JSON.stringify(res.data));
    }
  } catch (err) {
    console.error("Error fetching current user:", err);
    // If token expired or invalid
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    dispatch(setUserData(null));
  }
};

export default GetCurrentUser;
