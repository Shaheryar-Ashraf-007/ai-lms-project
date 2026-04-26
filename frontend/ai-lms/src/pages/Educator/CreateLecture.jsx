import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaTrash, FaPlus, FaVideo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../lib/axiosInstance";
import { ClipLoader } from "react-spinners";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";

const CreateLecture = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();

  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const { lectureData } = useSelector((state) => state.lecture);

  // ✅ FETCH LECTURES ON PAGE LOAD (FIX FOR REFRESH ISSUE)
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setFetching(true);

        const response = await axiosInstance.get(
          `/course/courselecture/${courseId}`,
          { withCredentials: true }
        );

        dispatch(setLectureData(response.data.lectures));
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch lectures"
        );
      } finally {
        setFetching(false);
      }
    };

    if (courseId) {
      fetchLectures();
    }
  }, [courseId, dispatch]);

  const handleCreateLecture = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        `/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true }
      );

      dispatch(setLectureData([...lectureData, response.data.lecture]));

      toast.success("Lecture created successfully!");
      setLectureTitle("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lecture");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) {
      return;
    }

    try {
      await axiosInstance.delete(
        `/course/deleteLecture/${courseId}/${lectureId}`,
        { withCredentials: true }
      );

      dispatch(
        setLectureData(
          lectureData.filter((lecture) => lecture._id !== lectureId)
        )
      );

      toast.success("Lecture deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lecture");
    }
  };

  const handleEditLecture = (lectureId) => {
    navigate(`/editlecture/${courseId}/${lectureId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Inter:wght@400;500;600&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .lecture-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .lecture-card:hover {
          transform: translateY(-2px);
        }
        
        .gradient-border {
          position: relative;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box;
          border: 2px solid transparent;
        }
        
        .shimmer {
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255,255,255,0.8) 50%, 
            transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FaVideo className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                Course Lectures
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage your course content
              </p>
            </div>
          </div>
        </div>

        {/* Create Lecture Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 fade-in stagger-1 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
              Add New Lecture
            </h2>
            <p className="text-sm text-gray-500">
              Enter a compelling title for your lecture
            </p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateLecture()}
                className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-800 focus:outline-none focus:border-indigo-500 transition-all duration-300 pl-12"
                placeholder="e.g., Introduction to MERN Stack Development"
              />
              <FaPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-300 hover:shadow-md"
              onClick={() => navigate(`/editcourse/${courseId}`)}
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Course
            </button>

            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              onClick={handleCreateLecture}
            >
              {loading ? (
                <>
                  <ClipLoader size={16} color="white" />
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus className="w-4 h-4" />
                  Create Lecture
                </>
              )}
            </button>
          </div>
        </div>

        {/* Lectures List */}
        <div className="fade-in stagger-2">
          {fetching ? (
            <div className="flex justify-center py-10">
              <ClipLoader size={40} color="#6366f1" />
            </div>
          ) : lectureData && lectureData.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Your Lectures
                </h2>
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-lg">
                  {lectureData.length} {lectureData.length === 1 ? "Lecture" : "Lectures"}
                </span>
              </div>

              <div className="space-y-3">
                {lectureData.map((lecture, index) => (
                  <div
                    key={lecture._id}
                    className="lecture-card group relative overflow-hidden rounded-xl border-2 border-gray-100 bg-white hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 font-semibold text-lg truncate group-hover:text-indigo-600 transition-colors">
                            {lecture.lectureTitle}
                          </h3>
                          <p className="text-gray-500 text-sm mt-0.5">
                            Click to view or edit lecture details
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditLecture(lecture._id)}
                          className="p-3 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-all duration-300"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteLecture(lecture._id)}
                          className="p-3 rounded-lg text-red-600 hover:bg-red-100 transition-all duration-300"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 w-0 group-hover:w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
                <FaVideo className="text-indigo-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                No Lectures Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start building your course by creating your first lecture above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
