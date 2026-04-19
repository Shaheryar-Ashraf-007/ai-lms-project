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
import EditCourses from "./pages/Educator/EditCourses";
import CreateLecture from "./pages/Educator/createLecture";
import EditLecture from "./pages/Educator/EditLecture";
import ViewCourses from "./pages/ViewCourses";
import PaymentSuccess from "./pages/PaymentSuccess"; // ✅ new

import { setUserData, clearUserData } from "./redux/userSlice";
import ViewLecture from "./pages/ViewLecture";
import MyEnrolledCourses from "./pages/MyEnrolledCourses";

function App() {
  const dispatch = useDispatch();
  const { userData, isAuthenticated } = useSelector((state) => state.user);

  // Restore user and token from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        dispatch(setUserData(JSON.parse(storedUser)));
      } catch (err) {
        console.error("Failed to parse userData:", err);
        dispatch(clearUserData());
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
    } else {
      dispatch(clearUserData());
    }
  }, [dispatch]);

  // Protect routes: only logged in users can access
  const ProtectedRoute = ({ children }) =>
    isAuthenticated ? children : <Navigate to="/login" />;

  // Educator route protection
  const EducatorRoute = ({ children }) =>
    isAuthenticated && userData?.role === "educator" ? (
      children
    ) : (
      <Navigate to="/" />
    );

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* Auth routes */}
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />

        {/* Protected User routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ✅ Payment success — protected so only logged-in users see it */}
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        {/* Educator routes */}
        <Route
          path="/dashboard"
          element={
            <EducatorRoute>
              <Dashboard />
            </EducatorRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <EducatorRoute>
              <Courses />
            </EducatorRoute>
          }
        />
        <Route
          path="/create"
          element={
            <EducatorRoute>
              <CreateCoursePage />
            </EducatorRoute>
          }
        />
        <Route
          path="/editCourse/:id"
          element={
            <EducatorRoute>
              <EditCourses />
            </EducatorRoute>
          }
        />
        <Route
          path="/createlecture/:courseId"
          element={
            <EducatorRoute>
              <CreateLecture />
            </EducatorRoute>
          }
        />
        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            <EducatorRoute>
              <EditLecture />
            </EducatorRoute>
          }
        />
        <Route
          path="/viewCourses/:courseId"
          element={
            <EducatorRoute>
              <ViewCourses />
            </EducatorRoute>
          }
        />

        <Route
          path="/viewLectures/:courseId"
          element={
            <EducatorRoute>
              <ViewLecture />
            </EducatorRoute>
          }
        />
        <Route
          path="/myCourses"
          element={
            userData?.role === "student" ? (
              <MyEnrolledCourses />
            ) : (
              <Navigate to="/Signup" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
