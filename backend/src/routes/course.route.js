import express from "express";
import {
  createCourse,
  createLecture,
  deleteCourse,
  deleteLecture,
  editCourse,
  editLecture,
  getAllCourses,
  getCoursebyId,
  getCourseLectures,
  getCreatorById,
  getcreatorCourses,
  getPublishedCourses,
} from "../controllers/course.Controller.js";
import { protectRoutes } from "../middleware/isAuth.js";
import uploads from "../middleware/multer.js";
import upload from "../middleware/multer.js";
import { searchController } from "../controllers/search.Controller.js";

const courseRouter = express.Router();

courseRouter.post("/create", protectRoutes, createCourse);
courseRouter.get("/getCourses/published", getPublishedCourses);
courseRouter.get("/creator", protectRoutes, getcreatorCourses);
courseRouter.post(
  "/editCourse/:courseId",
  protectRoutes,
  uploads.single("thumbnail"),
  editCourse,
);
courseRouter.get("/getCourses/:courseId", protectRoutes, getCoursebyId);
courseRouter.get("/getCourses", getAllCourses);
courseRouter.delete("/remove/:courseId", protectRoutes, deleteCourse);

// Lecture Routes
courseRouter.post("/createlecture/:courseId", protectRoutes, createLecture);
courseRouter.delete(
  "/deleteLecture/:courseId/:lectureId",
  protectRoutes,
  deleteLecture,
);
courseRouter.get("/courselecture/:courseId", protectRoutes, getCourseLectures);
courseRouter.post(
  "/editlecture/:lectureId",
  upload.single("video"),
  (err, req, res, next) => {
    if (err?.code === "LIMIT_FILE_SIZE") {
      return res
        .status(413)
        .json({ message: "File too large. Max size is 700MB." });
    }
    next(err);
  },
  editLecture,
);

courseRouter.post("/creator", protectRoutes, getCreatorById)

courseRouter.post("/search", searchController)

export default courseRouter;
