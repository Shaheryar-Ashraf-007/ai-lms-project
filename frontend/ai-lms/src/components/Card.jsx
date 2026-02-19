import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Card = ({
  title,
  id,
  name,
  description,
  thumbnail,
  instructor,
  duration,
  level,
  price,
  ratings,       
  students,
  category,
  onEnroll,  
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const navigate = useNavigate();

  // ─── Backend base URL ──────────────────────────────────────────────────────
  const BACKEND_URL = "http://localhost:3000";
  const imageUrl = thumbnail ? `${BACKEND_URL}${thumbnail}` : null;
  const showImage = imageUrl && !imgError;

  // ─── Category theming ──────────────────────────────────────────────────────
  // Solid accent classes only — no opacity-slash syntax (needs JIT / plugin)
  const categoryGradients = {
    Development: "from-emerald-500 via-teal-500 to-cyan-500",
    Design: "from-pink-500 via-rose-500 to-red-500",
    Business: "from-amber-500 via-orange-500 to-yellow-500",
    Marketing: "from-purple-500 via-violet-500 to-indigo-500",
    Data: "from-blue-500 via-indigo-500 to-purple-500",
    "Web Development": "from-emerald-500 via-teal-500 to-cyan-500",
  };

  const categoryAccents = {
    Development: "bg-emerald-100 text-emerald-700 border-emerald-300",
    Design: "bg-pink-100 text-pink-700 border-pink-300",
    Business: "bg-amber-100 text-amber-700 border-amber-300",
    Marketing: "bg-purple-100 text-purple-700 border-purple-300",
    Data: "bg-blue-100 text-blue-700 border-blue-300",
    "Web Development": "bg-emerald-100 text-emerald-700 border-emerald-300",
  };

  const gradient = categoryGradients[category] || categoryGradients["Development"];
  const accent  = categoryAccents[category]  || categoryAccents["Development"];

  // ─── Star renderer ─────────────────────────────────────────────────────────
  const renderStars = (value = 0) => {
    const num  = Math.min(5, Math.max(0, Number(value) || 0));
    const full = Math.floor(num);
    const hasHalf = num - full >= 0.25;

    return (
      <div className="flex items-center gap-0.5"  >
        {[1, 2, 3, 4, 5].map((i) => {
          let color = "text-gray-300";                              // empty
          if (i <= full)                      color = "text-amber-400"; // full
          else if (i === full + 1 && hasHalf) color = "text-amber-300"; // half

          return (
            <svg key={i} className={`w-4 h-4 ${color}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative group w-full h-full " onClick={()=>navigate(`/viewCourses/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Main Card ── */}
      <div
        className="relative bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
        style={{ transform: isHovered ? "translateY(-8px)" : "translateY(0)" }}
      >
        {/* Subtle gradient wash on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />

        {/* ── Thumbnail ── */}
        <div className="relative h-56 overflow-hidden">
          {showImage ? (
            <img
              src={imageUrl}
              alt={title || "Course Image"}
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
              onError={() => setImgError(true)}
            />
          ) : (
            /* Gradient fallback with book icon */
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <svg className="w-20 h-20 text-white opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          )}

          {/* Category badge */}
          {category && (
            <div className="absolute top-4 left-4 z-20">
              <span className={`px-4 py-2 ${accent} border rounded-full font-semibold text-xs uppercase tracking-wider shadow-md`}>
                {category}
              </span>
            </div>
          )}

          {/* Level badge */}
          {level && (
            <div className="absolute top-4 right-4 z-20">
              <span className="px-3 py-1.5 bg-white rounded-full text-gray-700 font-medium text-xs shadow-md border border-gray-100">
                {level}
              </span>
            </div>
          )}

          {/* Quick-glance rating pill on thumbnail */}
          {ratings != null && (
            <div className="absolute bottom-4 right-4 z-20">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-100">
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-bold text-gray-800">{Number(ratings).toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="p-6 flex-grow flex flex-col space-y-3">

          {/* Title — clamped to 2 lines (inline style; no plugin needed) */}
          {title && (
            <h3
              className="text-xl font-bold text-gray-900 leading-tight"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {title}
            </h3>
          )}

          {/* Description — clamped to 3 lines */}
          {description && (
            <p
              className="text-sm text-gray-500 leading-relaxed"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </p>
          )}

          {/* ── Full Star Ratings Row ── */}
          {ratings != null && (
            <div className="flex items-center gap-2">
              {renderStars(ratings)}
              <span className="text-sm font-semibold text-gray-700">
                {Number(ratings).toFixed(1)}
              </span>
              {students != null && (
                <span className="text-xs text-gray-400">
                  ({students.toLocaleString()} students)
                </span>
              )}
            </div>
          )}

          {/* Instructor — prefers `name`, falls back to `instructor` */}
          {(name || instructor) && (
            <div className="flex items-center gap-3 pt-1">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md shrink-0`}>
                <span className="text-white font-bold text-sm">
                  {(name || instructor).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Instructor</p>
                <p className="text-sm font-semibold text-gray-800">{name || instructor}</p>
              </div>
            </div>
          )}

          {/* Push stats + price to the bottom */}
          <div className="flex-grow" />

          {/* Duration / Students stats row */}
          {(duration || students != null) && (
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              {duration && (
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium">{duration}</span>
                </div>
              )}

              {students != null && (
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-xs font-medium">{students.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Price + Enroll button */}
          <div className="flex items-center justify-between pt-2">
            {price != null && (
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Price</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  ${Number(price).toFixed(2)}
                </p>
              </div>
            )}

            <button
              onClick={onEnroll}
              className={`px-6 py-3 bg-gradient-to-r ${gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}
            >
              Enroll Now
            </button>
          </div>
        </div>

        {/* Shimmer sweep on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Glow halo behind the card */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`} />
    </div>
  );
};

export default Card;