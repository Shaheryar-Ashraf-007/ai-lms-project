import express from "express";
import {
  createCourse,
  deleteCourse,
  editCourse,
  getCoursebyId,
  getcreatorCourses,
  getPublishedCourses,
} from "../controllers/course.Controller.js";
import { protectRoutes } from "../middleware/isAuth.js";
import uploads from "../middleware/multer.js";

const courseRouter = express.Router();

courseRouter.post("/create", protectRoutes,createCourse);
courseRouter.get("/getCourses/published", getPublishedCourses);
courseRouter.get("/creator", protectRoutes, getcreatorCourses);
courseRouter.post("/editCourse/:courseId",protectRoutes,uploads.single("thumbnail"),editCourse);
courseRouter.get("/getCourses/:courseId", protectRoutes, getCoursebyId);
courseRouter.delete("/remove/:courseId", protectRoutes, deleteCourse);

export default courseRouter;
