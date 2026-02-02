import express from "express"
import {  googleAuth, login, logout, resetPassword, sendOTP, Signup, verifyOTP } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup",Signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/sendOtp", sendOTP)
router.post("/verifyOtp", verifyOTP)
router.post("/resetPassword", resetPassword )
router.post("/googleauth", googleAuth)


export default router