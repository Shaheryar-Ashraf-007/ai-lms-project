import React from 'react';
import { MdExplore } from 'react-icons/md';
import { TbDeviceAnalytics } from 'react-icons/tb';
import { FaCode, FaPalette, FaMobile, FaChartLine, FaBullhorn, FaBrain, FaShieldAlt, FaCloud, FaBug } from 'react-icons/fa';

const EnrollCourse = () => {
  const courses = [
    { name: 'Web Development', icon: FaCode, color: 'bg-purple-100', iconColor: 'text-purple-600' },
    { name: 'UI/UX Designing', icon: FaPalette, color: 'bg-pink-100', iconColor: 'text-pink-600' },
    { name: 'App Development', icon: FaMobile, color: 'bg-blue-100', iconColor: 'text-blue-600' },
    { name: 'Data Science', icon: FaChartLine, color: 'bg-green-100', iconColor: 'text-green-600' },
    { name: 'Digital Marketing', icon: FaBullhorn, color: 'bg-orange-100', iconColor: 'text-orange-600' },
    { name: 'AI & Machine Learning', icon: FaBrain, color: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    { name: 'Cyber Security', icon: FaShieldAlt, color: 'bg-red-100', iconColor: 'text-red-600' },
    { name: 'Cloud Computing', icon: FaCloud, color: 'bg-cyan-100', iconColor: 'text-cyan-600' },
    { name: 'Software Testing', icon: FaBug, color: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Enroll in Our Courses
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Transform your career with industry-leading courses designed by experts. 
              Learn at your own pace and gain skills that matter in today's digital world.
            </p>

            <button className="group relative bg-gradient-to-r from-[#FBB03B] to-[#f59e0b] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-orange-300/50 transition-all duration-300 hover:scale-105 flex items-center gap-3 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <MdExplore  className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">Explore Our Courses</span>
            </button>
          </div>

          {/* Right Side - Course Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              const Icon = course.icon;
              return (
                <div
                  key={index}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-2"
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className={`w-24 h-24 ${course.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-6`}>
                      <Icon className={`w-12 h-12 ${course.iconColor} group-hover:scale-110 transition-transform`} />
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      {course.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollCourse;