import Course from "../models/CourseModel.js";

export const searchController = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: "Input is required" });
    }

    const courses = await Course.find({
      isPublished: true,   // ✅ correct casing
      $or: [               // ✅ each field in its own object
        { title:       { $regex: input, $options: "i" } },
        { subTitle:    { $regex: input, $options: "i" } },
        { description: { $regex: input, $options: "i" } },
        { category:    { $regex: input, $options: "i" } },
        { level:       { $regex: input, $options: "i" } },
      ]
    }).populate("lectures"); // optional — populate if needed

    return res.status(200).json(courses);

  } catch (error) {
    console.error("Search error:", error); // ← add this to see exact error
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// backend 