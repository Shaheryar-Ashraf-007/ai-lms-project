import { useEffect, useState } from "react";
import Card from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../redux/courseSlice";

const CardPage = () => {
  const dispatch = useDispatch();
  const { courseData, loading } = useSelector((state) => state.course);
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (courseData.length > 0) {
      setPopularCourses(courseData.slice(0, 6));
    }
  }, [courseData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 px-4">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-20 space-y-6">
          {/* Decorative Top Line */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full shadow-lg shadow-emerald-500/20"></div>
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></div>
              <div className="h-1 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-blue-500/20"></div>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Our Popular
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Courses
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover world-class learning experiences designed to transform your
            career
            <span className="block mt-2 text-gray-500">
              Join thousands of students already learning
            </span>
          </p>

          {/* Stats Bar */}
          {!loading && popularCourses.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {popularCourses.length}+
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Featured Courses
                </div>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Active Students
                </div>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  4.8★
                </div>
                <div className="text-sm text-gray-600 mt-1">Average Rating</div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="relative">
              {/* Outer Ring */}
              <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
              {/* Spinning Ring */}
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-emerald-500 border-r-teal-500 rounded-full animate-spin"></div>
              {/* Inner Glow */}
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-xl"></div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg font-semibold text-gray-700">
                Loading Amazing Courses
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please wait a moment...
              </p>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && popularCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {popularCourses.map((course, index) => (
              <div
                key={course._id} // ✅ use unique id
                className="transform transition-all duration-500"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`,
                }}
              >
                <Card
                  id={course._id} // ✅ pass it to Card as prop
                  title={course.title}
                  description={course.description || course.subtitle}
                  thumbnail={course.thumbnail}
                  instructor={course.instructor || course.creator}
                  duration={course.duration}
                  level={course.level}
                  price={course.price}
                  ratings={
                    course.ratings ??
                    (course.reviews?.length > 0
                      ? calculateAverageRating(course.reviews)
                      : null)
                  }
                  students={course.enrolledStudents?.length || 0}
                  category={course.category}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && popularCourses.length === 0 && (
          <div className="text-center py-32">
            <div className="mb-8 relative">
              {/* Animated Background */}
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-32 h-32 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
              </div>
              {/* Icon */}
              <svg
                className="w-32 h-32 mx-auto text-gray-300 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">
              No Courses Available Yet
            </h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
              We're working hard to bring you amazing learning content. Check
              back soon!
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
              Notify Me When Available
            </button>
          </div>
        )}

        {/* Bottom Decorative Element */}
        {!loading && popularCourses.length > 0 && (
          <div className="flex flex-col items-center mt-24 space-y-6">
            {/* Decorative Line */}
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/20"></div>
              <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full"></div>
              <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 rounded-full shadow-lg shadow-emerald-500/20"></div>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-4 mt-8">
              <h3 className="text-2xl font-bold text-gray-800">
                Ready to Start Learning?
              </h3>
              <p className="text-gray-600">
                Join thousands of students and transform your career today
              </p>
              <button className="mt-4 px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95">
                View All Courses →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Helper function to calculate average rating from reviews
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return null;
  const sum = reviews.reduce((acc, review) => acc + (review.ratings || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

export default CardPage;
