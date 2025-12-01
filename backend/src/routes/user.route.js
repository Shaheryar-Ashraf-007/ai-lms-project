import express from "express";
import { getCurrentUser, updateProfile } from "../controllers/user.controller.js";
import { protectRoutes } from "../middleware/isAuth.js";
import uploads from "../middleware/multer.js";

const router = express.Router();

router.get("/current-user",protectRoutes, getCurrentUser)
router.post("/profile",protectRoutes, uploads.single("photoUrl"), updateProfile );

export default router;