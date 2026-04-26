import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Tag, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../../lib/axiosInstance.js";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
  });

  const [errors, setErrors] = useState({});

  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Cloud Computing",
    "Cybersecurity",
    "DevOps",
    "UI/UX Design",
    "Game Development",
    "Digital Marketing",
    "Business & Management",
    "Photography",
    "Music",
    "Languages",
    "Other",
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Axios automatically attaches token from interceptor
      const response = await axiosInstance.post("/course/create", formData);

      console.log("Course created:", response.data);

      toast.success("Course created successfully!");
      navigate("/courses");
    } catch (error) {
      console.error("Error creating course:", error);

      toast.error(
        error.response?.data?.message ||
          "Unauthorized or failed to create course"
      );

      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Course
          </h1>
          <p className="text-gray-600">
            Start building your course by providing basic information
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Title */}
            <div>
              <label
                htmlFor="title"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Complete Web Development Bootcamp 2024"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">
                  ⚠ {errors.title}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Choose a clear, descriptive title
              </p>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
              >
                <Tag className="w-4 h-4 text-indigo-600" />
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white ${
                  errors.category
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">
                  ⚠ {errors.category}
                </p>
              )}
            </div>

            {/* Info */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-900 mb-2">
                💡 What's Next?
              </h3>
              <p className="text-sm text-indigo-800">
                After creating your course, you can add description,
                pricing, curriculum, and more.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/courses")}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
