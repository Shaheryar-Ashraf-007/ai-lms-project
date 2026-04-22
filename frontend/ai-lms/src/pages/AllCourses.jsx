import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axiosInstance";

const BACKEND_URL = "http://localhost:3000";

// ── Thumbnail URL builder ──────────────────────────────────────
const getThumbnail = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith("http")) return thumbnail;
  const clean = thumbnail.startsWith("/") ? thumbnail : `/${thumbnail}`;
  return `${BACKEND_URL}${clean}`;
};

// ── Skeleton card ──────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
    <div className="h-44 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded-full w-1/3" />
      <div className="h-4 bg-gray-200 rounded-full w-full" />
      <div className="h-4 bg-gray-200 rounded-full w-4/5" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-gray-200 rounded-full w-1/4" />
        <div className="h-8 bg-gray-200 rounded-xl w-1/3" />
      </div>
    </div>
  </div>
);

// ── Course card ────────────────────────────────────────────────
const CourseCard = ({ course, navigate }) => {
  const thumb = getThumbnail(course.thumbnail);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
      onClick={() => navigate(`/viewCourses/${course._id}`)}
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden flex-shrink-0">
        {thumb && !imgError ? (
          <img
            src={thumb}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = "none";
              setImgError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">🎓</span>
            <span className="text-xs text-blue-400 font-medium">
              {course.category || "Course"}
            </span>
          </div>
        )}

        {/* Category badge */}
        {course.category && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100 shadow-sm">
            {course.category}
          </div>
        )}

        {/* Level badge */}
        {course.level && (
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {course.level}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-1 flex-1">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Ratings */}
        {course.ratings > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(s => (
              <span
                key={s}
                className={`text-xs ${s <= course.ratings ? "text-yellow-400" : "text-gray-200"}`}
              >
                ★
              </span>
            ))}
            <span className="text-xs text-gray-400 ml-1">({course.ratings})</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 mt-auto">
          <div>
            <p className="text-lg font-bold text-blue-600">
              ${course.price ?? 0}
            </p>
            <p className="text-xs text-gray-400">
              {course.enrolledStudents?.length || 0} enrolled
            </p>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              navigate(`/viewCourses/${course._id}`);
            }}
            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm shadow-blue-100 whitespace-nowrap"
          >
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────
const AllCourses = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  // ── Fetch all published courses ──────────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/course/getCourses/published");
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.courses)
          ? res.data.courses
          : [];
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // ── Navigate to /search with query ──────────────────────────
  const handleAiSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAiSearch();
  };

  const suggestions = [
    "Beginner Python",
    "Web development",
    "UI/UX design",
    "Machine learning",
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO SEARCH HEADER ── */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-14 pb-24 px-4 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 right-1/3 w-48 h-48 bg-indigo-500/20 rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          {/* AI badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5">
            <span className="text-yellow-300 text-sm">✦</span>
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              AI-Powered Course Discovery
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            Find Your Perfect Course
          </h1>
          <p className="text-blue-200 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            Describe what you want to learn — our AI will find the best
            matching courses for you instantly
          </p>

          {/* ── Search bar ── */}
          <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-2xl shadow-blue-900/40">
            <div className="flex-1 flex items-center gap-3 px-3 min-w-0">
              <span className="text-blue-400 text-lg flex-shrink-0">🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='e.g. "I want to learn web development from scratch"'
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent py-2 font-medium min-w-0"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-gray-400 hover:text-gray-600 text-lg flex-shrink-0 transition-colors leading-none"
                >
                  ✕
                </button>
              )}
            </div>

            {/* ✅ Search with AI button — navigates to /search */}
            <button
              onClick={handleAiSearch}
              disabled={!query.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-300 flex-shrink-0 whitespace-nowrap"
            >
              <span>✦</span>
              Search with AI
            </button>
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="text-xs text-blue-100 border border-white/20 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5 transition-all font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 pb-16">

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-5 flex items-center justify-between">
            <span>⚠ {error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">All Courses</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading
                ? "Loading courses…"
                : `${courses.length} course${courses.length !== 1 ? "s" : ""} available`}
            </p>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="text-6xl">📭</span>
            <h3 className="text-xl font-bold text-gray-700">No courses yet</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Check back soon — new courses are being added regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCourses;