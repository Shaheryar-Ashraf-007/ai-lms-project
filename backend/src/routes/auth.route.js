import express from "express"
import {  login, logout, Signup } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup",  Signup)
router.post("/login", login)
router.post("/logout", logout)

export default router