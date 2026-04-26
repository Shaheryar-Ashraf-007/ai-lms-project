import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../lib/axiosInstance'

const ViewLecture = () => {
  const { courseId } = useParams()
  const { courseData } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)
  const selectedCourse = courseData.find(course => course._id === courseId)
  const [creatorCourse, setCreatorCourse] = useState(null)
  const [selectedLecture, setSelectedLecture] = useState(selectedCourse?.lectures?.[0] || null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completedLectures, setCompletedLectures] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const response = await axiosInstance.post(
            "/course/creator",
            { userId: selectedCourse?.creator },
            { withCredentials: true }
          )
          setCreatorCourse(response.data)
        } catch (error) {
          console.error("Error fetching creator data:", error)
        }
      }
    }
    handleCreator()
  }, [])

  const lectures = selectedCourse?.lectures || []
  const currentIndex = lectures.findIndex(l => l._id === selectedLecture?._id)
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null
  const nextLecture = currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null
  const progress = lectures.length > 0
    ? Math.round((completedLectures.length / lectures.length) * 100)
    : 0

  const handleMarkComplete = () => {
    if (selectedLecture && !completedLectures.includes(selectedLecture._id)) {
      setCompletedLectures(prev => [...prev, selectedLecture._id])
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">

      {/* ── TOP NAV ── */}
      <nav className="h-14 bg-white border-b border-blue-100 flex items-center justify-between px-4 flex-shrink-0 shadow-sm z-50">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-100 transition-all flex-shrink-0"
          >
            ← Back
          </button>
          <div className="w-px h-5 bg-blue-100 flex-shrink-0" />
          <p className="text-sm font-semibold text-gray-700 truncate hidden sm:block">
            {selectedCourse?.title || "Course"}
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
            <div className="w-20 h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-blue-600">{progress}%</span>
          </div>

          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all"
          >
            {sidebarOpen ? "✕ Hide" : "☰ Lectures"}
          </button>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── VIDEO + INFO PANEL ── */}
        <div className="flex-1 flex flex-col overflow-y-auto min-w-0 bg-white">

          {/* Video */}
          <div className="bg-gray-900 w-full aspect-video max-h-[65vh] flex-shrink-0">
            {selectedLecture?.videoUrl ? (
              <video
                key={selectedLecture._id}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                <source src={selectedLecture.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-500">
                <div className="w-16 h-16 rounded-full border-2 border-gray-700 flex items-center justify-center text-2xl">
                  ▶
                </div>
                <p className="text-sm font-medium">Select a lecture to begin</p>
              </div>
            )}
          </div>

          {/* Lecture info */}
          {selectedLecture && (
            <div
              key={selectedLecture._id}
              className="px-6 py-5 border-b border-gray-100"
            >
              <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-2">
                Lesson {String(currentIndex + 1).padStart(2, "0")} of {String(lectures.length).padStart(2, "0")}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {selectedLecture.lectureTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                {selectedCourse?.category && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    🎓 {selectedCourse.category}
                  </span>
                )}
                {selectedCourse?.level && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    📊 {selectedCourse.level}
                  </span>
                )}
                {userData?.name && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    👤 {userData.name}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Prev / Next / Complete */}
          <div className="px-6 py-4 flex items-center justify-between gap-3 flex-wrap border-b border-gray-100 bg-gray-50">
            <div className="flex gap-2">
              <button
                disabled={!prevLecture}
                onClick={() => prevLecture && setSelectedLecture(prevLecture)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-600"
              >
                ← Previous
              </button>
              <button
                disabled={!nextLecture}
                onClick={() => nextLecture && setSelectedLecture(nextLecture)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                Next →
              </button>
            </div>

            {selectedLecture && (
              <button
                onClick={handleMarkComplete}
                disabled={completedLectures.includes(selectedLecture._id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  completedLectures.includes(selectedLecture._id)
                    ? "bg-green-50 border-green-200 text-green-600 cursor-default"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-600"
                }`}
              >
                {completedLectures.includes(selectedLecture._id) ? (
                  <><span>✓</span> Completed</>
                ) : (
                  <><span>○</span> Mark as Complete</>
                )}
              </button>
            )}
          </div>

          {/* Instructor + Stats */}
          <div className="px-6 py-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              About this Course
            </h2>

            {/* Instructor card */}
            <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {creatorCourse?.name?.[0]?.toUpperCase() || "I"}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  {creatorCourse?.name || "Instructor"}
                </p>
                <p className="text-xs text-blue-500 font-semibold mt-0.5">
                  Course Instructor
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: lectures.length, label: "Lectures" },
                { val: completedLectures.length, label: "Completed" },
                { val: `${progress}%`, label: "Progress" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="bg-white border border-blue-100 rounded-xl p-4 text-center shadow-sm"
                >
                  <p className="text-2xl font-bold text-blue-600">{val}</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Course description */}
            {selectedCourse?.description && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <aside
          className={`bg-white border-l border-blue-100 flex flex-col overflow-hidden transition-all duration-300 flex-shrink-0 ${
            sidebarOpen ? "w-80" : "w-0 opacity-0 pointer-events-none"
          }`}
        >
          {/* Sidebar header */}
          <div className="px-5 py-4 border-b border-blue-100 flex-shrink-0 bg-blue-600">
            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">
              Course Content
            </p>
            <p className="text-sm font-bold text-white leading-snug mb-3 line-clamp-2">
              {selectedCourse?.title || "Course"}
            </p>
            {/* Mini progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-blue-500 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-bold text-blue-100 whitespace-nowrap">
                {completedLectures.length}/{lectures.length}
              </span>
            </div>
          </div>

          {/* Lecture list */}
          <div className="flex-1 overflow-y-auto">
            {lectures.length > 0 ? (
              lectures.map((lecture, index) => {
                const isActive = selectedLecture?._id === lecture._id
                const isDone = completedLectures.includes(lecture._id)

                return (
                  <div key={lecture._id}>
                    <div
                      onClick={() => setSelectedLecture(lecture)}
                      className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all border-l-4 ${
                        isActive
                          ? "bg-blue-50 border-l-blue-600"
                          : "border-l-transparent hover:bg-gray-50"
                      }`}
                    >
                      {/* Number / icon */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : isDone
                            ? "bg-green-100 text-green-600 border border-green-200"
                            : "bg-gray-100 text-gray-400 border border-gray-200"
                        }`}
                      >
                        {isActive ? "▶" : isDone ? "✓" : index + 1}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                          Lesson {String(index + 1).padStart(2, "0")}
                        </p>
                        <p
                          className={`text-sm font-semibold leading-snug line-clamp-2 ${
                            isActive ? "text-blue-700" : "text-gray-700"
                          }`}
                        >
                          {lecture.lectureTitle}
                        </p>

                        {/* Now playing */}
                        {isActive && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                              Now Playing
                            </span>
                          </div>
                        )}
                      </div>

                      {/* FREE / PRO badge */}
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-1 ${
                          lecture.isPreviewFree
                            ? "bg-green-100 text-green-600 border border-green-200"
                            : "bg-amber-100 text-amber-600 border border-amber-200"
                        }`}
                      >
                        {lecture.isPreviewFree ? "FREE" : "PRO"}
                      </span>
                    </div>

                    {/* Divider */}
                    {index < lectures.length - 1 && (
                      <div className="mx-4 h-px bg-gray-100" />
                    )}
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
                <span className="text-4xl">📭</span>
                <p className="text-sm font-medium">No lectures available</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ViewLecture