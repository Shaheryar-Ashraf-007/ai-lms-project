import React, { useState } from 'react';

const Card = ({ 
  title,
  description,
  thumbnail,
  instructor,
  duration,
  level,
  price,
  rating,
  students,
  category
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Backend base URL - CHANGE THIS TO YOUR ACTUAL BACKEND URL
  const BACKEND_URL = 'http://localhost:3000'; // e.g., 'http://localhost:5000' or 'https://api.yoursite.com'
  
  // Create full image URL from relative path
  const imageUrl = thumbnail ? `${BACKEND_URL}${thumbnail}` : null;

  const categoryGradients = {
    'Development': 'from-emerald-500 via-teal-500 to-cyan-500',
    'Design': 'from-pink-500 via-rose-500 to-red-500',
    'Business': 'from-amber-500 via-orange-500 to-yellow-500',
    'Marketing': 'from-purple-500 via-violet-500 to-indigo-500',
    'Data': 'from-blue-500 via-indigo-500 to-purple-500',
    'Web Development': 'from-emerald-500 via-teal-500 to-cyan-500', // Added for your API data
  };

  const categoryAccents = {
    'Development': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'Design': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    'Business': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Marketing': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    'Data': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Web Development': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', // Added for your API data
  };

  const gradient = categoryGradients[category] || categoryGradients['Development'];
  const accent = categoryAccents[category] || categoryAccents['Development'];

  return (
    <div 
      className="relative group w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div 
        className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
        style={{
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        }}
      >
        {/* Gradient Overlay on Hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
        />

        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          {/* Gradient Overlay on Image */}
          <div className={`absolute mix-blend-multiply z-10`} />
          
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title || 'Course Image'}
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              }}
              onError={(e) => {
                console.error('Image failed to load:', imageUrl);
                e.target.style.display = 'none';
                e.target.parentElement.querySelector('.fallback-gradient').style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Fallback Gradient Background */}
          <div 
            className={`fallback-gradient w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center absolute inset-0`}
            style={{ display: imageUrl ? 'none' : 'flex' }}
          >
            <svg 
              className="w-20 h-20 text-white/40" 
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

          {/* Category Badge */}
          {category && (
            <div className="absolute top-4 left-4 z-20">
              <div className={`px-4 py-2 ${accent} backdrop-blur-md text-white rounded-full border font-semibold text-xs uppercase tracking-wider shadow-lg`}>
                {category}
              </div>
            </div>
          )}

          {/* Level Badge */}
          {level && (
            <div className="absolute top-4 right-4 z-20">
              <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-gray-700 font-medium text-xs shadow-lg">
                {level}
              </div>
            </div>
          )}

          {/* Rating */}
          {rating && (
            <div className="absolute bottom-4 right-4 z-20">
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-lg">
                <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-bold text-gray-800">{rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex-grow flex flex-col space-y-4">
          {/* Title */}
          {title && (
            <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
              {title}
            </h3>
          )}

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {description}
            </p>
          )}

          {/* Instructor */}
          {instructor && (
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                <span className="text-white font-bold text-sm">
                  {instructor.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Instructor</p>
                <p className="text-sm font-semibold text-gray-800">{instructor}</p>
              </div>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Stats */}
          {(duration || students) && (
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              {duration && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium">{duration}</span>
                </div>
              )}
              
              {students && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-xs font-medium">{students?.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-2">
            {price && (
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Price</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  ${price}
                </p>
              </div>
            )}
            
            <button 
              className={`px-6 py-3 bg-gradient-to-r ${gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95`}
            >
              Enroll Now
            </button>
          </div>
        </div>

        {/* Shimmer Effect on Hover */}
        <div 
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        />
      </div>

      {/* Glow Effect */}
      <div 
        className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}
      />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Card;