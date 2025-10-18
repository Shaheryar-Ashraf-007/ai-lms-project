import React from 'react';
import { User, BookOpen } from 'lucide-react';

const Dropdown = ({ onClose }) => {
  return (
    <>
      {/* Dark Overlay */}
       <div 
          className='fixed inset-0 bg-opacity-10 transition-opacity duration-300'
          onClick={onClose}
        ></div>

      {/* Dropdown Menu */}
      <div className='w-52 rounded-xl bg-white shadow-2xl border border-gray-100 absolute right-4 top-16 overflow-hidden z-50'>
        {/* Menu Items */}
        <div className='p-2'>
          <div className='flex items-center gap-3 hover:bg-gradient-to-r hover:from-[#FBB03B] hover:to-[#f5a732] p-3 rounded-lg cursor-pointer transition-all duration-200 group text-gray-700 hover:text-white'>
            <User className='group-hover:text-white text-gray-600 transition-colors duration-200' size={20} />
            <span className='font-medium'>My Profile</span>
          </div>

          <div className='flex items-center gap-3 hover:bg-gradient-to-r hover:from-[#FBB03B] hover:to-[#f5a732] p-3 rounded-lg cursor-pointer transition-all duration-200 group text-gray-700 hover:text-white'>
            <BookOpen className='group-hover:text-white text-gray-600 transition-colors duration-200' size={20} />
            <span className='font-medium'>My Courses</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dropdown;