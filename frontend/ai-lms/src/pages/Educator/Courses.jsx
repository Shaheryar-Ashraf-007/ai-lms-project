import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../lib/axiosInstance";

const CoursesPage = () => {
  const { userData, isAuthenticated } = useSelector((state) => state.user);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isAuthenticated && userData?.role === "educator") {
      fetchCourses();
    }
  }, [isAuthenticated, userData]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/course/creator", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const coursesData = Array.isArray(response.data)
        ? response.data
        : response.data.courses || []; // fallback

      setCourses(coursesData);
      console.log("Fetched courses:", coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]); // ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const getThumbnailUrl = (thumbnail) => {
    if (!thumbnail)
      return "https://via.placeholder.com/400x300?text=No+Thumbnail";

    // If it's already a full URL
    if (thumbnail.startsWith("http")) return thumbnail;

    // If it's a relative path, construct full URL
    const baseUrl = "http://localhost:3000";
    const path = thumbnail.startsWith("/") ? thumbnail : "/" + thumbnail;
    return `${baseUrl}${path}`;
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axiosInstance.delete(`/course/remove/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleTogglePublish = async (courseId, currentStatus) => {
    try {
      await axiosInstance.post(
        `/course/editCourse/${courseId}`,
        { isPublished: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      navigate("/editCourse" + courseId);

      setCourses(
        courses.map((course) =>
          course._id === courseId
            ? { ...course, isPublished: !currentStatus }
            : course,
        ),
      );
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "published"
          ? course.isPublished
          : !course.isPublished;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Manage and organize your courses</p>
        </div>

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

            {/* Filter and Create */}
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
        {loading ? (
          <p>Loading...</p>
        ) : filteredCourses.length === 0 ? (
          <p>No courses found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={getThumbnailUrl(course.thumbnail)}
                    alt={course.title}
                    onError={(e) => {
                      console.error(
                        "Failed to load thumbnail:",
                        course.thumbnail,
                      );
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Thumbnail";
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

                <div className="pl-5 pr-5 pt-5">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 min-h-[1.5rem]">
                    {course.title}
                  </h3>
                   <p className="text-sm font-normal text-gray-900 mt-0">
                      {course.description || "No description available."}
                      </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">
                        ${course.price || 0}
                      </p>
                      <p className="text-sm text-gray-500">
                        {course.studentsEnrolled || 0} students
                      </p>

                       <p className="text-sm text-gray-500">
                        {course.ratings || 0} Ratings
                      </p>

                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
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
                          <EyeOff className="w-4 h-4" /> Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" /> Publish
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
