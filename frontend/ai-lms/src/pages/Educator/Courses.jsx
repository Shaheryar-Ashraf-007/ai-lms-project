import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../lib/axiosInstance";

// ─── Inline SVG used as a fallback when no thumbnail exists ─────────────────
const PLACEHOLDER_THUMBNAIL =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
       <rect width="400" height="300" fill="#e5e7eb"/>
       <text x="200" y="155" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#6b7280">No Thumbnail</text>
     </svg>`
  );

const CoursesPage = () => {
  const { userData, isAuthenticated } = useSelector((state) => state.user);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ← user-facing error state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // =========================
  // Fetch courses
  // =========================
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get("/course/creator", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const coursesData = Array.isArray(response.data)
        ? response.data
        : response.data.courses || [];

      setCourses(coursesData);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses. Please try again.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && userData?.role === "educator") {
      fetchCourses();
    } else {
      // Stop the spinner so non-educators don't see an endless loading state
      setLoading(false);
    }
  }, [isAuthenticated, userData, fetchCourses]);

  // =========================
  // Thumbnail helper
  // =========================
  const getThumbnailUrl = (thumbnail) => {
    if (!thumbnail) return PLACEHOLDER_THUMBNAIL;
    if (thumbnail.startsWith("http")) return thumbnail;

    const baseUrl = "http://localhost:3000";
    const path = thumbnail.startsWith("/") ? thumbnail : `/${thumbnail}`;
    return `${baseUrl}${path}`;
  };

  // =========================
  // Ratings helper ⭐
  // =========================
  const renderStars = (rating = 0) => {
    const value = Number(rating) || 0;

    return (
      <div className="flex items-center gap-1 text-yellow-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>{star <= value ? "★" : "☆"}</span>
        ))}
        <span className="ml-1 text-sm text-gray-500">({value})</span>
      </div>
    );
  };

  // =========================
  // Delete course
  // =========================
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axiosInstance.delete(`/course/remove/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses((prev) => prev.filter((course) => course._id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete course. Please try again.");
    }
  };

  // =========================
  // Toggle publish
  // =========================
  const handleTogglePublish = async (courseId, currentStatus) => {
    try {
      // PUT is semantically correct for updating a resource
      await axiosInstance.put(
        `/course/editCourse/${courseId}`,
        { isPublished: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCourses((prev) =>
        prev.map((course) =>
          course._id === courseId
            ? { ...course, isPublished: !currentStatus }
            : course
        )
      );
    } catch (err) {
      console.error("Error toggling publish status:", err);
      setError("Failed to update publish status. Please try again.");
    }
  };

  // =========================
  // Filters
  // =========================
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "published"
        ? course.isPublished
        : !course.isPublished;

    return matchesSearch && matchesFilter;
  });

  // =========================
  // Early returns
  // =========================

  // Still fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading courses...</p>
      </div>
    );
  }

  // Logged-in user is not an educator — don't render the page at all
  if (!isAuthenticated || userData?.role !== "educator") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Access denied. Only educators can manage courses.
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Manage and organize your courses</p>
        </div>

        {/* User-facing error banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter + Create */}
            <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full lg:w-auto pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Courses</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>

              <button
                onClick={() => navigate("/create")}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Course
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No courses found</p>
            <button
              onClick={() => navigate("/create")}
              className="mt-4 text-indigo-600 hover:underline font-medium"
            >
              Create your first course →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-200 overflow-hidden shrink-0">
                  <img
                    src={getThumbnailUrl(course.thumbnail)}
                    alt={course.title}
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_THUMBNAIL;
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.isPublished
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Title — clamped to 2 lines via inline style (no plugin needed) */}
                  <h3
                    className="text-xl font-bold text-gray-900"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "3.5rem",
                    }}
                  >
                    {course.title}
                  </h3>

                  {/* Description — clamped to 2 lines */}
                  <p
                    className="text-sm text-gray-500 mt-1"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.description || "No description available."}
                  </p>

                  {/* Price / Students / Rating */}
                  <div className="mt-4 mb-4">
                    <p className="text-2xl font-bold text-indigo-600">
                      ${course.price || 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      {course.studentsEnrolled || 0} students
                    </p>
                    <div className="mt-1">{renderStars(course.ratings)}</div>
                  </div>

                  {/* Action Buttons — pushed to bottom */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 mt-auto">
                    <button
                      onClick={() =>
                        handleTogglePublish(course._id, course.isPublished)
                      }
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        course.isPublished
                          ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {course.isPublished ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Publish
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => navigate(`/editCourse/${course._id}`)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all duration-200 font-medium"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;