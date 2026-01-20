import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ForgetPassword from "./pages/ForgetPassword";

import { setUserData } from "./redux/userSlice";
import Dashboard from "./pages/Educator/Dashboard";
import Courses from "./pages/Educator/Courses";

function App() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  // ✅ Restore user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      dispatch(setUserData(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Signup Route */}
        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to="/" />}
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" />}
        />

        {/* Profile Route (Protected) */}
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Forget Password Route (Public) */}
        <Route path="/forget-password" element={<ForgetPassword />} />

        <Route
          path="/dashboard"
          element={userData ?.role === "educator" ? <Dashboard /> : <Navigate to="/signup" />}
        />

         <Route
          path="/courses"
          element={userData ?.role === "educator" ? <Courses /> : <Navigate to="/signup" />}
        />
      </Routes>
    </>
  );
}

export default App;
