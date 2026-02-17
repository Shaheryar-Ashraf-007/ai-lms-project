import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ForgetPassword from "./pages/ForgetPassword";

import Dashboard from "./pages/Educator/Dashboard";
import Courses from "./pages/Educator/Courses";
import CreateCoursePage from "./pages/Educator/CreateCourses";

import { setUserData, clearUserData } from "./redux/userSlice";
import EditCourses from "./pages/Educator/EditCourses";
import CreateLecture from "./pages/Educator/createLecture";
import EditLecture from "./pages/Educator/EditLecture";
import ViewCourses from "./pages/ViewCourses";

function App() {
  const dispatch = useDispatch();
  const { userData, isAuthenticated } = useSelector((state) => state.user);

  // ✅ Restore user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      dispatch(setUserData(JSON.parse(storedUser)));
    } else {
      dispatch(clearUserData());
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* Auth Routes */}
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />

        {/* Protected User Route */}
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Educator Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && userData?.role === "educator" ? (
              <Dashboard />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />

        <Route
          path="/courses"
          element={
            isAuthenticated && userData?.role === "educator" ? (
              <Courses />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />

        <Route
          path="/create"
          element={
            isAuthenticated && userData?.role === "educator" ? (
              <CreateCoursePage />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />

        <Route
          path="/editCourse/:id"
          element={
            isAuthenticated && userData?.role === "educator" ? (
              <EditCourses />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />

        <Route
          path="/create"
          element={
            isAuthenticated && userData?.role === "educator" ? (
              <CreateCoursePage />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />

        <Route
          path="/createlecture/:courseId"
          element={
            userData?.role === "educator" ? (
              <CreateLecture />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />

        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            userData?.role === "educator" ? (
              <EditLecture />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />

        <Route
          path="/viewCourses/:courseId"
          element={
            userData?.role === "educator" ? (
              <ViewCourses />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
