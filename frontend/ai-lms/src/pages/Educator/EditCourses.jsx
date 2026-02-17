import { useState, useEffect } from "react";
import {
  BookOpen,
  Tag,
  DollarSign,
  FileText,
  Image,
  ArrowLeft,
  Loader2,
  Save,
  Eye,
  CheckCircle,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";

import axiosInstance from "../../../lib/axiosInstance.js";
import { GoArrowDownLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const EditCoursePage = ({ courseId: propCourseId }) => {
  const courseId = propCourseId || window.location.pathname.split("/").pop();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [selectCourses, setSelectCourses] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    level: "",
    ratings: "",
    price: "",
    thumbnail: null,
    requirements: [""],
    learningObjectives: [""],
    isPublished: false,
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

  const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
  const ratings = ["1", "2", "3", "4", "5"];

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        if (!courseId || courseId === "edit-course") {
          alert("Invalid course ID");
          setLoading(false);
          return;
        }

        console.log("Fetching course with ID:", courseId);

        const response = await axiosInstance.get(
          `/course/getCourses/${courseId}`,
        );

        console.log("Fetched course data:", response.data);
        setSelectCourses(response.data.course || response.data);

        const course = response.data.course || response.data;

        if (!course) {
          throw new Error("Course not found in response");
        }

        setFormData({
          title: course.title || "",
          subtitle: course.subtitle || course.subtitle || "",
          description: course.description || "",
          category: course.category || "",
          level: course.level || "",
          ratings: course.ratings ? String(course.ratings) : "",
          price: course.price ? String(course.price) : "",
          thumbnail: null,
          requirements:
            Array.isArray(course.requirements) && course.requirements.length > 0
              ? course.requirements
              : [""],
          learningObjectives:
            Array.isArray(course.learningObjectives) &&
            course.learningObjectives.length > 0
              ? course.learningObjectives
              : [""],
          isPublished: Boolean(course.isPublished),
        });

        // ✅ FIX #1: Check if thumbnail exists and is a string before calling startsWith
        if (course.thumbnail && typeof course.thumbnail === "string") {
          const thumbnailUrl = course.thumbnail.startsWith("http")
            ? course.thumbnail
            : `http://localhost:3000${course.thumbnail.startsWith("/") ? course.thumbnail : "/" + course.thumbnail}`;

          setThumbnailPreview(thumbnailUrl);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        alert(
          `Failed to load course: ${error.response?.data?.message || error.message}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = null;
        return;
      }

      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPG, PNG, WEBP)");
        e.target.value = null;
        return;
      }

      setFormData((prev) => ({ ...prev, thumbnail: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.ratings) {
      newErrors.ratings = "Rating is required";
    } else if (Number(formData.ratings) < 1 || Number(formData.ratings) > 5) {
      newErrors.ratings = "Rating must be between 1 and 5";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = "Price cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return alert("Please fix the errors before saving");

    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("category", formData.category);
      payload.append("price", String(formData.price));
      payload.append("isPublished", String(formData.isPublished));

      if (formData.subtitle?.trim())
        payload.append("subtitle", formData.subtitle.trim());
      if (formData.description?.trim())
        payload.append("description", formData.description.trim());
      if (formData.level) payload.append("level", formData.level);
      payload.append("ratings", String(Number(formData.ratings)));

      const requirements = formData.requirements
        .map((r) => r.trim())
        .filter(Boolean);
      const learningObjectives = formData.learningObjectives
        .map((o) => o.trim())
        .filter(Boolean);

      if (requirements.length)
        payload.append("requirements", JSON.stringify(requirements));
      if (learningObjectives.length)
        payload.append(
          "learningObjectives",
          JSON.stringify(learningObjectives),
        );

      if (formData.thumbnail instanceof File)
        payload.append("thumbnail", formData.thumbnail);

      const response = await axiosInstance.post(
        `/course/editCourse/${courseId}`,
        payload,
      );

      if (response.data?.success) {
        // ✅ FIX #2: Properly set the thumbnail preview from the server response
        const updatedCourse = response.data.course || {};

        if (
          updatedCourse.thumbnail &&
          typeof updatedCourse.thumbnail === "string"
        ) {
          const thumbnailUrl = updatedCourse.thumbnail.startsWith("http")
            ? updatedCourse.thumbnail
            : `http://localhost:3000${updatedCourse.thumbnail.startsWith("/") ? updatedCourse.thumbnail : "/" + updatedCourse.thumbnail}`;

          setThumbnailPreview(thumbnailUrl);
        }

        // Clear the file input since we now have the saved URL
        setFormData((prev) => ({
          ...prev,
          thumbnail: null,
        }));

        alert("Course updated successfully!");
      } else {
        throw new Error(response.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      alert(
        `Failed to save course: ${error.response?.data?.message || error.message}`,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (window.confirm("Are you sure? Any unsaved changes will be lost.")) {
      window.history.back();
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: BookOpen },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "content", label: "Course Content", icon: FileText },
    { id: "media", label: "Media", icon: Image },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading course data...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Courses
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
            <p className="text-gray-600 mt-1">Update your course information</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => alert("Preview coming soon!")}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={() => navigate(`/createlecture/${selectCourses?._id}`)}
              className="flex items-center gap-2 px-6 py-2 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoArrowDownLeft className="w-4 h-4" />
              Go to Lectures Page
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`mb-6 p-4 rounded-lg border-2 ${
            formData.isPublished
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {formData.isPublished ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
              <div>
                <p
                  className={`font-semibold ${
                    formData.isPublished ? "text-green-900" : "text-yellow-900"
                  }`}
                >
                  {formData.isPublished ? "Published" : "Draft"}
                </p>
                <p
                  className={`text-sm ${
                    formData.isPublished ? "text-green-700" : "text-yellow-700"
                  }`}
                >
                  {formData.isPublished
                    ? "This course is visible to students"
                    : "This course is not visible to students"}
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span className="font-medium text-gray-700">Published</span>
            </label>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-md border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-md p-8">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Complete Web Development Bootcamp"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">⚠ {errors.title}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="Brief tagline for your course"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Detailed description of your course"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                      errors.category
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600">
                      ⚠ {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">Select level</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Ratings
                  </label>
                  <select
                    name="ratings"
                    value={formData.ratings}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">Select Ratings</option>
                    {ratings.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <div className="max-w-md">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 text-indigo-600" />
                  Course Price *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.price
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600">⚠ {errors.price}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Set to 0 for a free course
                </p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  💰 Pricing Tips
                </h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Research competitor pricing in your category</li>
                  <li>• Consider your course length and depth</li>
                  <li>• Start with introductory pricing to attract students</li>
                </ul>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="space-y-8">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Requirements
                </label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleArrayChange("requirements", index, e.target.value)
                      }
                      placeholder="e.g., Basic computer skills"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("requirements", index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={formData.requirements.length === 1}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("requirements")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
                >
                  + Add Requirement
                </button>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Learning Objectives
                </label>
                {formData.learningObjectives.map((obj, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) =>
                        handleArrayChange(
                          "learningObjectives",
                          index,
                          e.target.value,
                        )
                      }
                      placeholder="e.g., Build responsive websites"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem("learningObjectives", index)
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={formData.learningObjectives.length === 1}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("learningObjectives")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
                >
                  + Add Learning Objective
                </button>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Image className="w-4 h-4 text-indigo-600" />
                  Course Thumbnail
                </label>

                {thumbnailPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailPreview(null);
                        setFormData((prev) => ({
                          ...prev,
                          thumbnail: null,
                        }));
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium">
                      Click to upload thumbnail
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, WEBP (Max 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </label>
                )}

                <p className="mt-3 text-sm text-gray-500">
                  Recommended size: 1280x720px (16:9 ratio)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
