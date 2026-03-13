import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCourse } from "../redux/courseSlice";
import axiosInstance from "../../lib/axiosInstance";

const ViewCourses = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { courseData, selectedCourse } = useSelector((state) => state.course);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);

  const [creatorCourse, setCreatorCourse] = useState(null);

  const BACKEND_URL = "http://localhost:3000";

  useEffect(() => {

    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const response = await axiosInstance.post("/course/creator", {userId:selectedCourse?.creator},
            {withCredentials: true});
            console.log("Creator data response:", response.data);
          setCreatorData(response.data);
        } catch (error) {
          console.error("Error fetching creator data:", error);
        }
      }
    };
    handleCreator();
  }, []);

  useEffect(() => {
    const course = courseData.find((course) => course._id === courseId);
    if (course) {
      dispatch(setSelectedCourse(course));
    }
  }, [courseId, courseData, dispatch]);

  useEffect(() => {
    if(creatorData?._id && courseData.length > 0) {
      const foundCourse = courseData.filter((course) => course.creator === creatorData._id && course._id !==courseId );
      setCreatorCourse(foundCourse);
    }

  }, [creatorData, courseData]);

  return (
    <div className="vc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .vc-root {
          min-height: 100vh;
          background: #f5f3ef;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Decorative top strip */
        .vc-root::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(90deg, #1a1040, #4f3cdb, #7c5fe6, #b06aff, #4f3cdb, #1a1040);
          background-size: 300% 100%;
          animation: shimmer 4s linear infinite;
          z-index: 100;
        }

        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: 300% 0; }
        }

        .vc-page {
          max-width: 1220px;
          margin: 0 auto;
          padding: 40px 28px 100px;
        }

        /* Back button */
        .vc-back {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #4f3cdb;
          background: #fff;
          border: 1.5px solid #e0dbf8;
          border-radius: 8px;
          padding: 9px 18px;
          cursor: pointer;
          margin-bottom: 40px;
          transition: all 0.2s;
          box-shadow: 0 2px 10px rgba(79,60,219,0.08);
        }
        .vc-back:hover {
          background: #f0edff;
          border-color: #c4b8f5;
          transform: translateX(-3px);
        }

        /* ── HERO ── */
        .vc-hero {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 0;
          background: #fff;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 8px 60px rgba(26,16,64,0.1);
          margin-bottom: 28px;
          border: 1px solid rgba(79,60,219,0.08);
        }

        .vc-thumb-col {
          position: relative;
          overflow: hidden;
        }

        .vc-thumb {
          width: 100%;
          height: 100%;
          min-height: 460px;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .vc-thumb:hover { transform: scale(1.03); }

        .vc-no-thumb {
          width: 100%;
          min-height: 460px;
          background: linear-gradient(135deg, #f0edff 0%, #e6e0ff 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #9188c4;
          font-size: 15px;
          font-weight: 500;
        }
        .vc-no-thumb span { font-size: 56px; }

        .vc-thumb-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent 60%, rgba(26,16,64,0.15));
          pointer-events: none;
        }

        .vc-info-col {
          padding: 48px 44px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          justify-content: center;
        }

        .vc-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .vc-badge {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
          border: 1.5px solid transparent;
        }
        .vc-badge-cat { background: #ede9ff; color: #4f3cdb; border-color: #c9c0f7; }
        .vc-badge-lvl { background: #fdf2ff; color: #9333ea; border-color: #e9b8f9; }

        .vc-title {
          font-family: 'Fraunces', serif;
          font-size: 38px;
          font-weight: 700;
          line-height: 1.18;
          color: #1a1040;
          letter-spacing: -0.01em;
        }

        .vc-desc {
          color: #6b7280;
          font-size: 15px;
          line-height: 1.75;
          max-width: 440px;
        }

        .vc-rating {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }
        .vc-stars { color: #f59e0b; letter-spacing: 2px; font-size: 18px; }
        .vc-rating-score { font-weight: 700; color: #1a1040; }
        .vc-rating-count { color: #9ca3af; }

        .vc-features {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .vc-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #4b5563;
        }
        .vc-feature-dot {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f3cdb, #7c5fe6);
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .vc-price-enroll {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #1a1040 0%, #2d1f6e 100%);
          border-radius: 16px;
          margin-top: 4px;
        }
        .vc-price-label { font-size: 10px; color: #9882e8; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .vc-price-amount {
          font-family: 'Fraunces', serif;
          font-size: 40px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .vc-enroll-btn {
          margin-left: auto;
          background: linear-gradient(135deg, #7c5fe6, #b06aff);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(176,106,255,0.4);
          transition: all 0.2s;
          white-space: nowrap;
        }
        .vc-enroll-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(176,106,255,0.55);
        }

        .vc-students {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }
        .vc-students strong { color: #1a1040; font-weight: 700; }

        /* ── META CARDS ── */
        .vc-meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .vc-meta-card {
          background: #fff;
          border-radius: 20px;
          padding: 26px 24px;
          border: 1px solid #ede8ff;
          box-shadow: 0 4px 20px rgba(79,60,219,0.06);
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .vc-meta-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(79,60,219,0.12);
        }
        .vc-meta-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #4f3cdb, #b06aff);
        }
        .vc-meta-icon { font-size: 26px; margin-bottom: 4px; }
        .vc-meta-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #a89fd4; }
        .vc-meta-value { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: #1a1040; }

        /* ── LECTURES ── */
        .vc-lectures-wrap {
          background: #fff;
          border-radius: 28px;
          padding: 40px;
          border: 1px solid #ede8ff;
          box-shadow: 0 4px 30px rgba(79,60,219,0.07);
        }
        .vc-lectures-title {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 700;
          color: #1a1040;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .vc-lectures-title-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          background: #ede9ff;
          color: #4f3cdb;
          padding: 4px 12px;
          border-radius: 100px;
          margin-left: 4px;
        }

        .vc-lecture-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 24px;
        }

        /* Lecture list */
        .vc-lecture-list { display: flex; flex-direction: column; gap: 10px; }

        .vc-lecture-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 14px;
          border: 1.5px solid #ede8ff;
          background: #faf9ff;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .vc-lecture-item.free {
          cursor: pointer;
        }
        .vc-lecture-item.free:hover {
          border-color: #c4b8f5;
          background: #f5f2ff;
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(79,60,219,0.1);
        }
        .vc-lecture-item.locked {
          cursor: not-allowed;
          opacity: 0.58;
        }

        .vc-lecture-num {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          font-weight: 700;
        }
        .vc-lecture-num.free-num {
          background: linear-gradient(135deg, #4f3cdb, #7c5fe6);
          color: #fff;
          box-shadow: 0 4px 12px rgba(79,60,219,0.3);
        }
        .vc-lecture-num.lock-num {
          background: #f0eff5;
          color: #b0a8c8;
        }

        .vc-lecture-text { flex: 1; min-width: 0; }
        .vc-lecture-index { font-size: 10px; color: #b0a8c8; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2px; }
        .vc-lecture-name { font-size: 14px; font-weight: 600; color: #1a1040; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .vc-lecture-name.locked-name { color: #b0a8c8; }

        .vc-pill {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .vc-pill-free { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .vc-pill-lock { background: #fef9ec; color: #b45309; border: 1px solid #fde68a; }

        /* Video panel */
        .vc-video-panel {
          border-radius: 18px;
          overflow: hidden;
          background: #0e0a24;
          border: 1px solid rgba(79,60,219,0.2);
          box-shadow: 0 8px 40px rgba(26,16,64,0.2);
          display: flex;
          flex-direction: column;
        }
        .vc-video-top {
          padding: 14px 20px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .vc-video-dot { width: 8px; height: 8px; border-radius: 50%; background: #7c5fe6; box-shadow: 0 0 8px #7c5fe6; }
        .vc-video-label { font-size: 13px; font-weight: 600; color: #c4b8f5; }
        .vc-video-area {
          aspect-ratio: 16/9;
          width: 100%;
          background: #050310;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vc-video-area video { width: 100%; height: 100%; display: block; outline: none; }
        .vc-video-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          color: #4a3d7a;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          padding: 20px;
        }
        .vc-video-placeholder-icon {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: rgba(79,60,219,0.15);
          border: 1.5px solid rgba(79,60,219,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
        }
        .vc-no-lectures {
          padding: 60px 20px;
          text-align: center;
          color: #b0a8c8;
          font-size: 15px;
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .vc-hero { grid-template-columns: 1fr; }
          .vc-thumb { min-height: 280px; }
          .vc-meta-grid { grid-template-columns: 1fr 1fr; }
          .vc-lecture-grid { grid-template-columns: 1fr; }
          .vc-info-col { padding: 32px 24px; }
        }
      `}</style>

      <div className="vc-page">

        {/* BACK BUTTON */}
        <button className="vc-back" onClick={() => navigate("/")}>
          <FaArrowLeftLong style={{ width: 15, height: 15 }} />
          Back to Courses
        </button>

        {/* ══ HERO ══ */}
        <div className="vc-hero">

          {/* Thumbnail */}
          <div className="vc-thumb-col">
            {selectedCourse?.thumbnail ? (
              <img
                src={`${BACKEND_URL}${selectedCourse.thumbnail}`}
                alt="course"
                className="vc-thumb"
              />
            ) : (
              <div className="vc-no-thumb">
                <span>🎓</span>
                No Preview Available
              </div>
            )}
            <div className="vc-thumb-overlay" />
          </div>

          {/* Info */}
          <div className="vc-info-col">

            <div className="vc-badges">
              {selectedCourse?.category && (
                <span className="vc-badge vc-badge-cat">{selectedCourse.category}</span>
              )}
              {selectedCourse?.level && (
                <span className="vc-badge vc-badge-lvl">{selectedCourse.level}</span>
              )}
            </div>

            <h1 className="vc-title">{selectedCourse?.title || "Course Title"}</h1>

            <p className="vc-desc">{selectedCourse?.description}</p>

            <div className="vc-rating">
              <span className="vc-stars">★★★★★</span>
              <span className="vc-rating-score">{selectedCourse?.ratings || 0}/5 Rating</span>
              <span className="vc-rating-count">(1,200 Reviews)</span>
            </div>

            <div className="vc-features">
              {["10+ hours of video content", "Lifetime access to materials", "Certificate of Completion"].map((f) => (
                <div className="vc-feature" key={f}>
                  <div className="vc-feature-dot">✓</div>
                  {f}
                </div>
              ))}
            </div>

            <div className="vc-price-enroll">
              <div>
                <p className="vc-price-label">Course Price</p>
                <p className="vc-price-amount">${selectedCourse?.price ?? "—"}</p>
              </div>
              <button className="vc-enroll-btn">Enroll Now →</button>
            </div>

            <div className="vc-students">
              <span>👨‍🎓</span>
              Enrolled Students:
              <strong>{selectedCourse?.enrolledStudents?.length || 0}</strong>
            </div>
          </div>
        </div>

        {/* ══ META CARDS ══ */}
        <div className="vc-meta-grid">
          <div className="vc-meta-card">
            <div className="vc-meta-icon">👨‍💼</div>
            <div className="vc-meta-label">Instructor</div>
            <div className="vc-meta-value">{selectedCourse?.creator?.name || "Unknown Instructor"}</div>
          </div>
          <div className="vc-meta-card">
            <div className="vc-meta-icon">{selectedCourse?.isPublished ? "✅" : "❌"}</div>
            <div className="vc-meta-label">Publish Status</div>
            <div className="vc-meta-value" style={{ color: selectedCourse?.isPublished ? "#059669" : "#dc2626" }}>
              {selectedCourse?.isPublished ? "Published" : "Not Published"}
            </div>
          </div>
          <div className="vc-meta-card">
            <div className="vc-meta-icon">💬</div>
            <div className="vc-meta-label">Reviews</div>
            <div className="vc-meta-value">{selectedCourse?.reviews?.length || "1.3k"} Reviews</div>
          </div>
        </div>

        {/* ══ LECTURES ══ */}
        <div className="vc-lectures-wrap">
          <h2 className="vc-lectures-title">
            Course Lectures
            <span className="vc-lectures-title-count">
              {selectedCourse?.lectures?.length || 0} lessons
            </span>
          </h2>

          <div className="vc-lecture-grid">

            {/* LEFT — lecture list */}
            <div className="vc-lecture-list">
              {selectedCourse?.lectures?.length > 0 ? (
                selectedCourse.lectures.map((lecture, index) => (
                  <div
                    key={lecture._id}
                    className={`vc-lecture-item ${lecture.isPreviewFree ? "free" : "locked"}`}
                    onClick={() => { if (lecture.isPreviewFree) setSelectedLecture(lecture); }}
                  >
                    <div className={`vc-lecture-num ${lecture.isPreviewFree ? "free-num" : "lock-num"}`}>
                      {lecture.isPreviewFree ? "▶" : "🔒"}
                    </div>
                    <div className="vc-lecture-text">
                      <div className="vc-lecture-index">Lesson {String(index + 1).padStart(2, "0")}</div>
                      <div className={`vc-lecture-name ${!lecture.isPreviewFree ? "locked-name" : ""}`}>
                        {lecture.lectureTitle}
                      </div>
                    </div>
                    <span className={`vc-pill ${lecture.isPreviewFree ? "vc-pill-free" : "vc-pill-lock"}`}>
                      {lecture.isPreviewFree ? "FREE" : "PREMIUM"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="vc-no-lectures">📭 No lectures available</div>
              )}
            </div>

            {/* RIGHT — video */}
            <div className="vc-video-panel">
              <div className="vc-video-top">
                <div className="vc-video-dot" />
                <span className="vc-video-label">
                  {selectedLecture ? selectedLecture.lectureTitle : "Preview Player"}
                </span>
              </div>
              <div className="vc-video-area">
                {selectedLecture ? (
                  <video controls autoPlay key={selectedLecture._id}>
                    <source src={selectedLecture.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div className="vc-video-placeholder">
                    <div className="vc-video-placeholder-icon">▶</div>
                    Select a free lecture to preview
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-gray-500">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Write a review 
          </h2>
          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400 text-2xl cursor-pointer">
                  ★
                </span>
              ))}
            </div>
          </div>
          <textarea className="w-full border border-gray-200  rounded-lg p-2" name="" id="" placeholder="
          Write your review here..." rows={3}>
            
          </textarea>

          <button className="rounded p-4 bg-amber-300 text-white">Submit Now</button>
        </div>
        
      </div>
    </div>
  );
};

export default ViewCourses;