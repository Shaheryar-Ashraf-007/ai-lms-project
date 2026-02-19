import Course from "../models/CourseModel.js";
import Lecture from "../models/LectureModel.js";
import uploadCloudinary from "../config/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and Category are required",
      });
    }

    const course = await Course.create({
      title,
      category,
      creator: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate("lectures");
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published courses found",
      });
    }
    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch published courses",
      error: error.message,
    });
  }
};

export const getcreatorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.user._id });
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this creator",
      });
    }
    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch creator's courses",
      error: error.message,
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const {
      title,
      subTitle,
      description,
      category,
      level,
      price,
      ratings, // ✅ ADD THIS
      isPublished,
      requirements,
      learningObjectives,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ✅ Update primitive fields
    if (title) course.title = title;
    if (subTitle) course.subTitle = subTitle;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;

    if (price !== undefined) {
      course.price = Number(price);
    }

    // ✅ FIX: Ratings update (IMPORTANT)
    if (ratings !== undefined && ratings !== "") {
      course.ratings = Number(ratings);
    }

    if (isPublished !== undefined) {
      course.isPublished = isPublished === "true" || isPublished === true;
    }

    // ✅ Parse arrays safely
    if (requirements) {
      course.requirements = Array.isArray(requirements)
        ? requirements
        : JSON.parse(requirements);
    }

    if (learningObjectives) {
      course.learningObjectives = Array.isArray(learningObjectives)
        ? learningObjectives
        : JSON.parse(learningObjectives);
    }

    // ✅ Handle thumbnail upload
    if (req.file) {
      course.thumbnail = `/uploads/${req.file.filename}`;
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Edit course error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCoursebyId = async (req, res) => {
  try {
    const { courseId } = req.params;
    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    await Course.findByIdAndDelete(courseId);
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;

    const { courseId } = req.params;

    if (!courseId || !lectureTitle) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Lecture Title are required",
      });
    }

    const lecture = await Lecture.create({
      lectureTitle,
    });

    const course = await Course.findById(courseId);

    if (course) {
      course.lectures.push(lecture._id);
      await course.populate("lectures");
      await course.save();
      return res.status(201).json({
        success: true,
        message: "Lecture created and added to course successfully",
        lecture,
        course,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture",
      error: error.message,
    });
  }
};

export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    await course.populate("lectures");
    await course.save();
    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lectures",
      error: error.message,
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    let { isPreviewFree, lectureTitle } = req.body;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // ✅ Convert string to boolean properly
    if (typeof isPreviewFree !== "undefined") {
      lecture.isPreviewFree = isPreviewFree === "true";
    }

    // ✅ Update title safely
    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }

    // ✅ Handle video upload
    if (req.file) {
      try {
        const videoUrl = await uploadCloudinary(req.file.path);
        lecture.videoUrl = videoUrl;
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Video upload failed",
          error: err.message,
        });
      }
    }

    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    console.error("Edit lecture error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture",
      error: error.message,
    });
  }
};



export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (lecture) {
      return res.status(200).json({
        success: true,
        message: "Lecture deleted successfully",
      });
    }

    await Course.updateMany(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );
    return res.status(404).json({
      success: false,
      message: "Lecture not found",
    });
  } catch (error) {

  }
};
