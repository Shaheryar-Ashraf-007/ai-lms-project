import { Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import { ToastContainer } from "react-toastify"
import GetCurrentUser from "./customHooks/getCurrentUser.js"

function App() {
  return (
    <>
    <GetCurrentUser/>
    <ToastContainer/>

    <Routes>
      <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

    </Routes>
    </>
  )
}

export default App
