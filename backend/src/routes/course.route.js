import express from "express";
import {
  createCourse,
  deleteCourse,
  editCourse,
  getCoursebyId,
  getcreatorCourses,
  getPublishedCourses,
} from "../controllers/course.Controller";
import { protectRoutes } from "../middleware/isAuth";
import uploads from "../middleware/multer";

const courseRouter = express.Router();

courseRouter.post("/create", protectRoutes, createCourse);
courseRouter.get("/published", getPublishedCourses);
courseRouter.get("/creator", protectRoutes, getcreatorCourses);
courseRouter.post(
  "/editCourse/:courseId",
  protectRoutes,
  uploads.single("thumbnail"),
  editCourse,
);
courseRouter.get("/getCourse/:courseId", protectRoutes, getCoursebyId);
courseRouter.delete("/remove/:courseId", protectRoutes, deleteCourse);

export default courseRouter;
