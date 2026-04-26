
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCourse } from "../redux/courseSlice";
import axiosInstance from "../../lib/axiosInstance";
import Card from "../components/Card.jsx";
import StripeWrapper from "../components/StripeWrapper.jsx";
import CheckoutForm from "../components/CheckOutForm.jsx";

const ViewCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { courseData, selectedCourse } = useSelector((state) => state.course);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourse, setCreatorCourse] = useState(null);
  const [checkoutCourseId, setCheckoutCourseId] = useState(null);

  const { userData } = useSelector((state) => state.user);

  // Review state
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ✅ Handle Enroll button — uses courseId from useParams
  const handleEnrollClick = (id) => {
    setCheckoutCourseId(id);
  };

  // ✅ Close checkout modal
  const handleCloseCheckout = () => {
    setCheckoutCourseId(null);
  };

  // Check if current user is already enrolled
const isEnrolled = selectedCourse?.enrolledStudents?.some(
  (id) => id === userData?._id || id?.toString() === userData?._id?.toString()
);

  const BACKEND_URL = import.meta.env.VITE_API_URL || ""; // ← set this in .env.local

  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const response = await axiosInstance.post("/course/creator",{ userId: selectedCourse?.creator },
            { withCredentials: true },
          );
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
    if (course) dispatch(setSelectedCourse(course));
  }, [courseId, courseData, dispatch]);

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const foundCourse = courseData.filter(
        (course) =>
          course.creator === creatorData._id && course._id !== courseId,
      );
      setCreatorCourse(foundCourse);
    }
  }, [creatorData, courseData]);

  const handleSubmit = () => {
    if (selectedStar === 0 || reviewText.trim() === "") return;
    setSubmitted(true);
    // TODO: wire up your API call here
  };

  const starLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

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
        .vc-thumb-col { position: relative; overflow: hidden; }
        .vc-thumb {
          width: 100%; height: 100%; min-height: 460px;
          object-fit: cover; display: block;
          transition: transform 0.6s ease;
        }
        .vc-thumb:hover { transform: scale(1.03); }
        .vc-no-thumb {
          width: 100%; min-height: 460px;
          background: linear-gradient(135deg, #f0edff 0%, #e6e0ff 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 12px; color: #9188c4;
          font-size: 15px; font-weight: 500;
        }
        .vc-no-thumb span { font-size: 56px; }
        .vc-thumb-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, transparent 60%, rgba(26,16,64,0.15));
          pointer-events: none;
        }
        .vc-info-col {
          padding: 48px 44px;
          display: flex; flex-direction: column;
          gap: 22px; justify-content: center;
        }
        .vc-badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .vc-badge {
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 5px 14px;
          border-radius: 100px; border: 1.5px solid transparent;
        }
        .vc-badge-cat { background: #ede9ff; color: #4f3cdb; border-color: #c9c0f7; }
        .vc-badge-lvl { background: #fdf2ff; color: #9333ea; border-color: #e9b8f9; }
        .vc-title {
          font-family: 'Fraunces', serif; font-size: 38px;
          font-weight: 700; line-height: 1.18;
          color: #1a1040; letter-spacing: -0.01em;
        }
        .vc-desc { color: #6b7280; font-size: 15px; line-height: 1.75; max-width: 440px; }
        .vc-rating { display: flex; align-items: center; gap: 10px; font-size: 14px; }
        .vc-stars { color: #f59e0b; letter-spacing: 2px; font-size: 18px; }
        .vc-rating-score { font-weight: 700; color: #1a1040; }
        .vc-rating-count { color: #9ca3af; }
        .vc-features { display: flex; flex-direction: column; gap: 9px; }
        .vc-feature { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #4b5563; }
        .vc-feature-dot {
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg, #4f3cdb, #7c5fe6);
          color: #fff; font-size: 11px; font-weight: 800;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .vc-price-enroll {
          display: flex; align-items: center; gap: 20px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #1a1040 0%, #2d1f6e 100%);
          border-radius: 16px; margin-top: 4px;
        }
        .vc-price-label { font-size: 10px; color: #9882e8; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .vc-price-amount { font-family: 'Fraunces', serif; font-size: 40px; font-weight: 700; color: #fff; line-height: 1; }
        .vc-enroll-btn {
          margin-left: auto;
          background: linear-gradient(135deg, #7c5fe6, #b06aff);
          color: #fff; border: none; border-radius: 12px;
          padding: 14px 28px; font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: 15px; cursor: pointer;
          box-shadow: 0 6px 24px rgba(176,106,255,0.4);
          transition: all 0.2s; white-space: nowrap;
        }
        .vc-enroll-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(176,106,255,0.55); }
        .vc-students { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #6b7280; }
        .vc-students strong { color: #1a1040; font-weight: 700; }

        /* ── META CARDS ── */
        .vc-meta-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-bottom: 28px;
        }
        .vc-meta-card {
          background: #fff; border-radius: 20px; padding: 26px 24px;
          border: 1px solid #ede8ff;
          box-shadow: 0 4px 20px rgba(79,60,219,0.06);
          display: flex; flex-direction: column; gap: 6px;
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .vc-meta-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(79,60,219,0.12); }
        .vc-meta-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 3px; background: linear-gradient(90deg, #4f3cdb, #b06aff);
        }
        .vc-meta-icon { font-size: 26px; margin-bottom: 4px; }
        .vc-meta-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #a89fd4; }
        .vc-meta-value { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: #1a1040; }

        /* ── LECTURES ── */
        .vc-lectures-wrap {
          background: #fff; border-radius: 28px; padding: 40px;
          border: 1px solid #ede8ff;
          box-shadow: 0 4px 30px rgba(79,60,219,0.07);
        }
        .vc-lectures-title {
          font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700;
          color: #1a1040; margin-bottom: 28px;
          display: flex; align-items: center; gap: 12px;
        }
        .vc-lectures-title-count {
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          background: #ede9ff; color: #4f3cdb;
          padding: 4px 12px; border-radius: 100px; margin-left: 4px;
        }
        .vc-lecture-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; }
        .vc-lecture-list { display: flex; flex-direction: column; gap: 10px; }
        .vc-lecture-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 18px; border-radius: 14px;
          border: 1.5px solid #ede8ff; background: #faf9ff;
          transition: all 0.2s; position: relative; overflow: hidden;
        }
        .vc-lecture-item.free { cursor: pointer; }
        .vc-lecture-item.free:hover {
          border-color: #c4b8f5; background: #f5f2ff;
          transform: translateX(4px); box-shadow: 0 4px 16px rgba(79,60,219,0.1);
        }
        .vc-lecture-item.locked { cursor: not-allowed; opacity: 0.58; }
        .vc-lecture-num {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0; font-weight: 700;
        }
        .vc-lecture-num.free-num { background: linear-gradient(135deg, #4f3cdb, #7c5fe6); color: #fff; box-shadow: 0 4px 12px rgba(79,60,219,0.3); }
        .vc-lecture-num.lock-num { background: #f0eff5; color: #b0a8c8; }
        .vc-lecture-text { flex: 1; min-width: 0; }
        .vc-lecture-index { font-size: 10px; color: #b0a8c8; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2px; }
        .vc-lecture-name { font-size: 14px; font-weight: 600; color: #1a1040; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .vc-lecture-name.locked-name { color: #b0a8c8; }
        .vc-pill { padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; flex-shrink: 0; }
        .vc-pill-free { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .vc-pill-lock { background: #fef9ec; color: #b45309; border: 1px solid #fde68a; }
        .vc-video-panel {
          border-radius: 18px; overflow: hidden; background: #0e0a24;
          border: 1px solid rgba(79,60,219,0.2);
          box-shadow: 0 8px 40px rgba(26,16,64,0.2);
          display: flex; flex-direction: column;
        }
        .vc-video-top {
          padding: 14px 20px; background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; gap: 10px;
        }
        .vc-video-dot { width: 8px; height: 8px; border-radius: 50%; background: #7c5fe6; box-shadow: 0 0 8px #7c5fe6; }
        .vc-video-label { font-size: 13px; font-weight: 600; color: #c4b8f5; }
        .vc-video-area { aspect-ratio: 16/9; width: 100%; background: #050310; display: flex; align-items: center; justify-content: center; }
        .vc-video-area video { width: 100%; height: 100%; display: block; outline: none; }
        .vc-video-placeholder { display: flex; flex-direction: column; align-items: center; gap: 14px; color: #4a3d7a; font-size: 14px; font-weight: 500; text-align: center; padding: 20px; }
        .vc-video-placeholder-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(79,60,219,0.15); border: 1.5px solid rgba(79,60,219,0.25); display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .vc-no-lectures { padding: 60px 20px; text-align: center; color: #b0a8c8; font-size: 15px; font-weight: 500; }

        /* ══ REVIEW SECTION ══ */
        .vc-review-wrap {
          margin-top: 28px;
          background: #fff;
          border-radius: 28px;
          border: 1px solid #ede8ff;
          box-shadow: 0 4px 30px rgba(79,60,219,0.07);
          overflow: hidden;
        }

        .vc-review-header {
          background: linear-gradient(135deg, #1a1040 0%, #2d1f6e 100%);
          padding: 32px 40px;
          position: relative;
          overflow: hidden;
        }
        .vc-review-header::before {
          content: '✦';
          position: absolute;
          right: 40px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 80px;
          color: rgba(176,106,255,0.12);
          pointer-events: none;
          line-height: 1;
        }
        .vc-review-header-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9882e8;
          margin-bottom: 6px;
        }
        .vc-review-header-title {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }
        .vc-review-header-sub {
          font-size: 14px;
          color: #9882e8;
          margin-top: 6px;
        }

        .vc-review-body {
          padding: 40px;
        }

        /* Star rating */
        .vc-star-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
        }
        .vc-star-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .vc-star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          line-height: 1;
          font-size: 36px;
          transition: transform 0.15s ease;
          color: #e5e2f0;
          filter: drop-shadow(0 0 0px transparent);
        }
        .vc-star-btn.active {
          color: #f59e0b;
          filter: drop-shadow(0 2px 8px rgba(245,158,11,0.45));
        }
        .vc-star-btn:hover {
          transform: scale(1.25) rotate(-5deg);
        }
        .vc-star-label-badge {
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          background: #fef3c7;
          color: #92400e;
          border: 1.5px solid #fde68a;
          transition: all 0.2s;
          min-width: 90px;
          text-align: center;
        }
        .vc-star-label-badge.empty {
          background: #f5f3ff;
          color: #b0a8c8;
          border-color: #ede8ff;
        }

        /* Textarea */
        .vc-review-textarea-wrap {
          position: relative;
          margin-bottom: 28px;
        }
        .vc-review-textarea {
          width: 100%;
          min-height: 130px;
          background: #faf9ff;
          border: 1.5px solid #ede8ff;
          border-radius: 16px;
          padding: 18px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #1a1040;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          line-height: 1.65;
        }
        .vc-review-textarea::placeholder { color: #c4bce0; }
        .vc-review-textarea:focus {
          border-color: #7c5fe6;
          box-shadow: 0 0 0 4px rgba(124,95,230,0.1);
          background: #fff;
        }
        .vc-char-count {
          position: absolute;
          bottom: 12px;
          right: 16px;
          font-size: 12px;
          color: #c4bce0;
          font-weight: 500;
          pointer-events: none;
        }
        .vc-char-count.warn { color: #f59e0b; }

        /* Submit row */
        .vc-review-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .vc-review-hint {
          font-size: 13px;
          color: #b0a8c8;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vc-submit-btn {
          position: relative;
          padding: 14px 36px;
          background: linear-gradient(135deg, #4f3cdb, #7c5fe6, #b06aff);
          background-size: 200% 100%;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 24px rgba(79,60,219,0.35);
          overflow: hidden;
          letter-spacing: 0.02em;
        }
        .vc-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .vc-submit-btn:hover::before { opacity: 1; }
        .vc-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(79,60,219,0.45);
          background-position: 100% 0;
        }
        .vc-submit-btn:active { transform: translateY(0); }
        .vc-submit-btn:disabled {
          opacity: 0.42;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Success state */
        .vc-review-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 48px 20px;
          text-align: center;
          animation: fadeInUp 0.4s ease;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vc-success-icon {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f3cdb, #b06aff);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px;
          box-shadow: 0 8px 32px rgba(79,60,219,0.35);
        }
        .vc-success-title {
          font-family: 'Fraunces', serif;
          font-size: 26px; font-weight: 700; color: #1a1040;
        }
        .vc-success-sub { font-size: 15px; color: #6b7280; max-width: 340px; }
        .vc-success-stars { color: #f59e0b; font-size: 26px; letter-spacing: 4px; }

        /* Divider */
        .vc-review-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #ede8ff, transparent);
          margin: 0 40px 0;
        }

        /* ══ EDUCATOR COURSES ══ */
        .vc-educator-wrap {
          margin-top: 28px;
          background: #fff;
          border-radius: 28px;
          border: 1px solid #ede8ff;
          box-shadow: 0 4px 30px rgba(79,60,219,0.07);
          overflow: hidden;
        }

        .vc-educator-header {
          padding: 32px 40px 0;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .vc-educator-title {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 700;
          color: #1a1040;
        }

        .vc-educator-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
          padding: 28px 40px 40px;
        }

        .vc-educator-empty {
          padding: 48px 40px;
          text-align: center;
          color: #b0a8c8;
          font-size: 15px;
          font-weight: 500;
        }

        /* ══ PAYMENT MODAL ══ */
        .vc-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 6, 30, 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: overlayIn 0.25s ease;
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .vc-modal-backdrop {
          position: absolute;
          inset: 0;
          cursor: pointer;
        }

        .vc-modal-box {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 500px;
          background: #fff;
          border-radius: 28px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(79,60,219,0.12),
            0 32px 80px rgba(10,6,30,0.45),
            0 0 60px rgba(124,95,230,0.15);
          animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(28px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Modal header gradient band */
        .vc-modal-header {
          background: linear-gradient(135deg, #1a1040 0%, #2d1f6e 100%);
          padding: 28px 32px 24px;
          position: relative;
          overflow: hidden;
        }
        .vc-modal-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(176,106,255,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .vc-modal-header::after {
          content: '';
          position: absolute;
          bottom: -30px; left: -20px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,60,219,0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        .vc-modal-close {
          position: absolute;
          top: 16px; right: 16px;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          color: #c4b8f5;
          font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 2;
          line-height: 1;
        }
        .vc-modal-close:hover {
          background: rgba(255,255,255,0.2);
          color: #fff;
          transform: rotate(90deg);
        }

        .vc-modal-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9882e8;
          margin-bottom: 6px;
          position: relative; z-index: 1;
        }
        .vc-modal-title {
          font-family: 'Fraunces', serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          position: relative; z-index: 1;
        }

        /* Course summary pill inside modal */
        .vc-modal-course-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 12px 16px;
          position: relative; z-index: 1;
        }
        .vc-modal-course-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c5fe6, #b06aff);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .vc-modal-course-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .vc-modal-course-price {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 700;
          color: #b06aff;
          flex-shrink: 0;
        }

        /* Modal body */
        .vc-modal-body {
          padding: 28px 32px 32px;
        }

        /* Secure badge row */
        .vc-modal-secure {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #059669;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 10px;
          padding: 8px 14px;
          margin-bottom: 20px;
          width: fit-content;
        }

        /* Card element wrapper */
        .vc-card-field-wrap {
          background: #faf9ff;
          border: 1.5px solid #ede8ff;
          border-radius: 14px;
          padding: 16px 18px;
          margin-bottom: 20px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .vc-card-field-wrap:focus-within {
          border-color: #7c5fe6;
          box-shadow: 0 0 0 4px rgba(124,95,230,0.1);
          background: #fff;
        }
        .vc-card-field-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #a89fd4;
          margin-bottom: 10px;
        }

        /* Pay button inside modal */
        .vc-pay-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #4f3cdb, #7c5fe6, #b06aff);
          background-size: 200% 100%;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 16px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 24px rgba(79,60,219,0.35);
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .vc-pay-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(79,60,219,0.5);
          background-position: 100% 0;
        }
        .vc-pay-btn:active:not(:disabled) { transform: translateY(0); }
        .vc-pay-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Spinner */
        .vc-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Error box inside modal */
        .vc-modal-error {
          background: #fef2f2;
          border: 1.5px solid #fecaca;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 13px;
          color: #dc2626;
          font-weight: 500;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Stripe branding footer */
        .vc-modal-stripe-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 16px;
          font-size: 12px;
          color: #b0a8c8;
          font-weight: 500;
        }
        .vc-modal-stripe-note strong { color: #7c5fe6; }

        @media (max-width: 900px) {
          .vc-educator-header { padding: 28px 24px 0; }
          .vc-educator-grid { padding: 20px 24px 28px; grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .vc-educator-grid { grid-template-columns: 1fr; }
          .vc-modal-box { border-radius: 20px; }
          .vc-modal-header { padding: 24px 24px 20px; }
          .vc-modal-body { padding: 24px 24px 28px; }
        }

        @media (max-width: 900px) {
          .vc-hero { grid-template-columns: 1fr; }
          .vc-thumb { min-height: 280px; }
          .vc-meta-grid { grid-template-columns: 1fr 1fr; }
          .vc-lecture-grid { grid-template-columns: 1fr; }
          .vc-info-col { padding: 32px 24px; }
          .vc-review-header { padding: 28px 24px; }
          .vc-review-body { padding: 28px 24px; }
          .vc-review-divider { margin: 0 24px; }
        }
      `}</style>

      <div className="vc-page">
        {/* BACK */}
        <button className="vc-back" onClick={() => navigate("/")}>
          <FaArrowLeftLong style={{ width: 15, height: 15 }} />
          Back to Courses
        </button>

        {/* ══ HERO ══ */}
        <div className="vc-hero">
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
          <div className="vc-info-col">
            <div className="vc-badges">
              {selectedCourse?.category && (
                <span className="vc-badge vc-badge-cat">
                  {selectedCourse.category}
                </span>
              )}
              {selectedCourse?.level && (
                <span className="vc-badge vc-badge-lvl">
                  {selectedCourse.level}
                </span>
              )}
            </div>
            <h1 className="vc-title">
              {selectedCourse?.title || "Course Title"}
            </h1>
            <p className="vc-desc">{selectedCourse?.description}</p>
            <div className="vc-rating">
              <span className="vc-stars">★★★★★</span>
              <span className="vc-rating-score">
                {selectedCourse?.ratings || 0}/5 Rating
              </span>
              <span className="vc-rating-count">(1,200 Reviews)</span>
            </div>
            <div className="vc-features">
              {[
                "10+ hours of video content",
                "Lifetime access to materials",
                "Certificate of Completion",
              ].map((f) => (
                <div className="vc-feature" key={f}>
                  <div className="vc-feature-dot">✓</div>
                  {f}
                </div>
              ))}
            </div>
            <div className="vc-price-enroll">
              <div>
                <p className="vc-price-label">Course Price</p>
                <p className="vc-price-amount">
                  ${selectedCourse?.price ?? "—"}
                </p>
              </div>
              {/* ✅ Fixed: uses courseId from useParams */}
              {isEnrolled ? (
    // ✅ User already paid — show Watch Now
    <button
      className="vc-enroll-btn"
      onClick={() => navigate(`/viewLectures/${courseId}`)} // change route as per your app
    >
      Watch Now ▶
    </button>
  ) : (
    // ✅ Not enrolled — show Enroll Now
    <button
      className="vc-enroll-btn"
      onClick={() => handleEnrollClick(courseId)}
    >
      Enroll Now →
    </button>
  )}
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
            <div className="vc-meta-value">
              {selectedCourse?.creator?.name || "Unknown Instructor"}
            </div>
          </div>
          <div className="vc-meta-card">
            <div className="vc-meta-icon">
              {selectedCourse?.isPublished ? "✅" : "❌"}
            </div>
            <div className="vc-meta-label">Publish Status</div>
            <div
              className="vc-meta-value"
              style={{
                color: selectedCourse?.isPublished ? "#059669" : "#dc2626",
              }}
            >
              {selectedCourse?.isPublished ? "Published" : "Not Published"}
            </div>
          </div>
          <div className="vc-meta-card">
            <div className="vc-meta-icon">💬</div>
            <div className="vc-meta-label">Reviews</div>
            <div className="vc-meta-value">
              {selectedCourse?.reviews?.length || "1.3k"} Reviews
            </div>
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
            <div className="vc-lecture-list">
              {selectedCourse?.lectures?.length > 0 ? (
                selectedCourse.lectures.map((lecture, index) => (
                  <div
                    key={lecture._id}
                    className={`vc-lecture-item ${lecture.isPreviewFree ? "free" : "locked"}`}
                    onClick={() => {
                      if (lecture.isPreviewFree) setSelectedLecture(lecture);
                    }}
                  >
                    <div
                      className={`vc-lecture-num ${lecture.isPreviewFree ? "free-num" : "lock-num"}`}
                    >
                      {lecture.isPreviewFree ? "▶" : "🔒"}
                    </div>
                    <div className="vc-lecture-text">
                      <div className="vc-lecture-index">
                        Lesson {String(index + 1).padStart(2, "0")}
                      </div>
                      <div
                        className={`vc-lecture-name ${!lecture.isPreviewFree ? "locked-name" : ""}`}
                      >
                        {lecture.lectureTitle}
                      </div>
                    </div>
                    <span
                      className={`vc-pill ${lecture.isPreviewFree ? "vc-pill-free" : "vc-pill-lock"}`}
                    >
                      {lecture.isPreviewFree ? "FREE" : "PREMIUM"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="vc-no-lectures">📭 No lectures available</div>
              )}
            </div>
            <div className="vc-video-panel">
              <div className="vc-video-top">
                <div className="vc-video-dot" />
                <span className="vc-video-label">
                  {selectedLecture
                    ? selectedLecture.lectureTitle
                    : "Preview Player"}
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

        {/* ══ REVIEW SECTION ══ */}
        <div className="vc-review-wrap">
          {/* Header */}
          <div className="vc-review-header">
            <p className="vc-review-header-eyebrow">Your Experience</p>
            <h2 className="vc-review-header-title">Leave a Review</h2>
            <p className="vc-review-header-sub">
              Help other learners by sharing what you think
            </p>
          </div>

          <div className="vc-review-divider" style={{ marginTop: 0 }} />

          <div className="vc-review-body">
            {submitted ? (
              <div className="vc-review-success">
                <div className="vc-success-icon">✓</div>
                <div className="vc-success-stars">
                  {"★".repeat(selectedStar)}
                </div>
                <p className="vc-success-title">Thanks for your review!</p>
                <p className="vc-success-sub">
                  Your feedback helps thousands of learners choose the right
                  course.
                </p>
              </div>
            ) : (
              <>
                <div className="vc-star-row">
                  <div className="vc-star-group">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`vc-star-btn ${star <= (hoveredStar || selectedStar) ? "active" : ""}`}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setSelectedStar(star)}
                        aria-label={`Rate ${star} stars`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span
                    className={`vc-star-label-badge ${(hoveredStar || selectedStar) === 0 ? "empty" : ""}`}
                  >
                    {starLabels[hoveredStar || selectedStar] || "Rate it"}
                  </span>
                </div>

                <div className="vc-review-textarea-wrap">
                  <textarea
                    className="vc-review-textarea"
                    placeholder="Share your thoughts — what did you love? What could be improved?"
                    rows={5}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    maxLength={500}
                  />
                  <span
                    className={`vc-char-count ${reviewText.length > 450 ? "warn" : ""}`}
                  >
                    {reviewText.length} / 500
                  </span>
                </div>

                <div className="vc-review-actions">
                  <p className="vc-review-hint">
                    <span>🔒</span>
                    Your review will be publicly visible
                  </p>
                  <button
                    className="vc-submit-btn"
                    onClick={handleSubmit}
                    disabled={selectedStar === 0 || reviewText.trim() === ""}
                  >
                    Submit Review →
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ══ EDUCATOR COURSES ══ */}
          {creatorCourse?.length > 0 && (
            <div className="vc-educator-wrap">
              <div className="vc-educator-header">
                <h2 className="vc-educator-title">More by this Instructor</h2>
                <span className="vc-lectures-title-count">
                  {creatorCourse.length} courses
                </span>
              </div>
              <div className="vc-educator-grid">
                {creatorCourse.map((course, index) => (
                  <Card
                    key={index}
                    thumbnail={course.thumbnail}
                    id={course._id}
                    price={course.price}
                    title={course.title}
                    category={course.category}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ PAYMENT MODAL — rendered outside vc-page, at root level ══ */}
      {checkoutCourseId && (
        <div className="vc-modal-overlay">
          {/* Clicking backdrop closes modal */}
          <div className="vc-modal-backdrop" onClick={handleCloseCheckout} />

          <div className="vc-modal-box">
            {/* ── Modal Header ── */}
            <div className="vc-modal-header">
              <button className="vc-modal-close" onClick={handleCloseCheckout}>
                ✕
              </button>
              <p className="vc-modal-eyebrow">Secure Checkout</p>
              <h2 className="vc-modal-title">Complete Your Enrollment</h2>

              {/* Course summary pill */}
              <div className="vc-modal-course-pill">
                <div className="vc-modal-course-icon">🎓</div>
                <span className="vc-modal-course-name">
                  {selectedCourse?.title || "Course"}
                </span>
                <span className="vc-modal-course-price">
                  ${selectedCourse?.price ?? "—"}
                </span>
              </div>
            </div>

            {/* ── Modal Body — CheckoutForm lives here wrapped in StripeWrapper ── */}
            <div className="vc-modal-body">
              <div className="vc-modal-secure">
                🔒 &nbsp;256-bit SSL encrypted payment
              </div>

              {/* ✅ StripeWrapper provides Elements context, CheckoutForm uses it */}
              <StripeWrapper>
                <CheckoutForm
                  courseId={checkoutCourseId}
                  onClose={handleCloseCheckout}
                />
              </StripeWrapper>

              <p className="vc-modal-stripe-note">
                Powered by <strong>Stripe</strong> · Your card info is never stored
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCourses;