import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import { protectRoutes } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/current-user",protectRoutes, getCurrentUser)

export default router;