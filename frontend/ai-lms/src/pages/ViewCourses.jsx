import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCourse } from "../redux/courseSlice";

const ViewCourses = () => {
  const navigate = useNavigate();

  const { courseData, selectedCourse } = useSelector((state) => state.course);

  const { courseId } = useParams();

  const dispatch = useDispatch();

  const [selectedLecture, setSelectedLecture] = useState(null);

  // ✅ SAME LOGIC (not changed)
  const fetchSelectedCourse = async () => {
    courseData.map((course) => {
      if (course._id === courseId) {
        dispatch(setSelectedCourse(course));

        console.log("Selected Course:", selectedCourse);

        return null;
      }
    });
  };

  useEffect(() => {
    fetchSelectedCourse();
  }, [courseId, courseData]);

  const BACKEND_URL = "http://localhost:3000";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-10 relative">
        {/* BACK BUTTON */}

        <FaArrowLeftLong
          className="text-black w-[22px] h-[22px] cursor-pointer hover:scale-110 transition"
          onClick={() => navigate("/")}
        />

        {/* ================= HERO SECTION ================= */}

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Thumbnail */}

          <div>
            {selectedCourse?.thumbnail ? (
              <img
                src={`${BACKEND_URL}${selectedCourse.thumbnail}`}
                alt="course"
                className="w-full h-[380px] rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <p>No Image</p>
            )}
          </div>

          {/* Course Info */}

          <div className="space-y-5">
            <h1 className="text-4xl font-bold text-gray-900">
              {selectedCourse?.title}
            </h1>

            <p className="text-gray-600 leading-relaxed">
              {selectedCourse?.description}
            </p>

            {/* Category + Level */}

            <div className="flex gap-3 flex-wrap">
              <span className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                {selectedCourse?.category}
              </span>

              <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                {selectedCourse?.level}
              </span>
            </div>

            {/* Ratings */}

            <div className="flex items-center gap-2">
              ⭐⭐⭐⭐⭐
              <span className="font-semibold text-gray-800">
                {selectedCourse?.ratings || 0}/5 Rating
                <span className="text-gray-500 ml-2">(1,200) Reviews</span>
              </span>
            </div>

            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>10+ hours of video Content</li>
              <li>LifeTime Access to Course Material</li>
              <li>Certificate of Completion</li>
            </ul>

            <button className="bg-amber-500 p-2 rounded-md cursor-pointer text-white">
              Enroll Now
            </button>

            {/* Price */}

            <div>
              <p className="text-sm text-gray-500">Course Price</p>

              <p className="text-4xl font-bold text-emerald-600">
                ${selectedCourse?.price}
              </p>
            </div>

            {/* Students */}

            <div className="text-gray-600">
              👨‍🎓 Enrolled Students :
              <span className="font-bold ml-2">
                {selectedCourse?.enrolledStudents?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* ================= COURSE DETAILS ================= */}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Instructor */}

          <div className="bg-gray-50 rounded-xl p-6 shadow">
            <h3 className="font-bold text-lg mb-3">Instructor</h3>

            <p className="text-gray-700">
              {selectedCourse?.creator?.name || "Unknown Instructor"}
            </p>
          </div>

          {/* Publish Status */}

          <div className="bg-gray-50 rounded-xl p-6 shadow">
            <h3 className="font-bold text-lg mb-3">Publish Status</h3>

            <p className="font-semibold">
              {selectedCourse?.isPublished
                ? "✅ Published"
                : "❌ Not Published"}
            </p>
          </div>

          {/* Reviews */}

          <div className="bg-gray-50 rounded-xl p-6 shadow">
            <h3 className="font-bold text-lg mb-3">Reviews</h3>

            <p>{selectedCourse?.reviews?.length || "1.3k"} Reviews</p>
          </div>
        </div>

        {/* ================= LECTURES ================= */}

        <div>
          <h2 className="text-3xl font-bold mb-6">Course Lectures</h2>

          <div className="space-y-4">
            {selectedCourse?.lectures?.length > 0 ? (
              selectedCourse.lectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="flex justify-between items-center bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-semibold text-lg">Lecture {index + 1}</p>

                    <p className="text-gray-600">{lecture.lectureTitle}</p>
                  </div>

                  <div>
                    <button
                      disabled={!lecture.isPreviewFree}
                      onClick={() => {
                        if (lecture.isPreviewFree) {
                          setSelectedLecture(lecture);
                        }
                      }}
                      className={`px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm ${lecture.isPreviewFree && "hover:bg-green-200 transition cursor-pointer"}`}
                    >
                      Free Preview
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No Lectures Available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourses;
