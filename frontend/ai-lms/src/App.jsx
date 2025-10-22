import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import GetCurrentUser from "./customHooks/getCurrentUser.js";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";

function App() {
  GetCurrentUser();

  const { userData } = useSelector((state) => state.user);
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to={"/"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to={"/signup"} />}
        />

        <Route
          path="/forget-password"
          element={ <ForgetPassword />}
        />
      </Routes>
    </>
  );
}

export default App;
