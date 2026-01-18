import React, { useEffect, useState } from 'react'
import { Search, BookOpen } from 'lucide-react'
import Navbar from "../components/Navbar"
import EnrollCourse from '../components/EnrollCourse';


const Home = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className="w-full overflow-hidden bg-gray-50">
      {/* Navbar with scroll behavior */}
      <div className={`fixed top-0 w-full z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <Navbar />
      </div>

      {/* Hero Section */}
      <div className="w-full relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80"
            alt="Students learning"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-36">
          {/* Main Heading */}
          <div className="text-center  mb-12 animate-fade-in">
            <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight">
              Grow Your Skills to
            </h1>
            <h1 className="text-[#FBB03B] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight">
              Advance Your Career Path
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mt-6 px-4">
              Unlock your potential with expert-led courses designed to help you succeed in today's competitive world
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-12">
            <button className="group relative w-full sm:w-auto bg-[#FBB03B] cursor-pointer text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg hover:bg-[#e89f2f] transition-all duration-300 shadow-2xl hover:shadow-[#FBB03B]/50 hover:scale-105 flex items-center justify-center gap-3">
              <BookOpen className="w-5 h-5 " />
              View All Courses
              <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
            </button>
            
            <button className="group relative w-full sm:w-auto cursor-pointer bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-2xl hover:scale-105 flex items-center justify-center gap-3">
              <Search className="w-5 h-5" />
              Search with AI
              <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-20 pt-12 border-t border-white/20">
            <div className="text-center">
              <div className="text-[#FBB03B] text-4xl sm:text-5xl font-bold mb-2">500+</div>
              <div className="text-gray-300 text-sm sm:text-base">Expert Courses</div>
            </div>
            <div className="text-center">
              <div className="text-[#FBB03B] text-4xl sm:text-5xl font-bold mb-2">50K+</div>
              <div className="text-gray-300 text-sm sm:text-base">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-[#FBB03B] text-4xl sm:text-5xl font-bold mb-2">95%</div>
              <div className="text-gray-300 text-sm sm:text-base">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Additional content section for scroll demo */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Featured Courses
          </h2>
          <p className="text-gray-600 text-lg">
            Scroll to see the navbar hide/show effect
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>

      <EnrollCourse/>
    </div>
  )
}

export default Home