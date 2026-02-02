import Course from "../models/CourseModel.js";

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
    const courses = await Course.find({ isPublished: true });
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
      isPublished,
      requirements,
      learningObjectives,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // ✅ Update fields
    if (title) course.title = title;
    if (subTitle) course.subTitle = subTitle;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (price) course.price = price;
    if (isPublished !== undefined) course.isPublished = isPublished === "true";

    // ✅ Parse arrays if sent
    if (requirements) course.requirements = JSON.parse(requirements);
    if (learningObjectives) course.learningObjectives = JSON.parse(learningObjectives);

    // ✅ Handle new thumbnail if uploaded
    if (req.file) {
      course.thumbnail = `/uploads/${req.file.filename}`; // Save relative path
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });

  } catch (error) {
    console.error("Edit course error:", error);
    return res.status(500).json({ success: false, message: error.message });
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
