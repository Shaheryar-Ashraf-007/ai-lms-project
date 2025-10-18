import React from 'react';
import { Home, User, LayoutDashboard, LogOut, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const SideModal = ({ onClose, userRole }) => {
  // userRole can be 'student' or 'educator'
  const isEducator = userRole === 'educator';

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onClose();
    // dispatch(clearUserData());
    // navigate('/login');
  };

  return (
    <>
      {/* Dark Overlay */}
      <div 
        className='fixed inset-0 bg-black  z-10 transition-opacity duration-300'
        onClick={onClose}
      ></div>

      {/* Side Modal */}
      <div className='fixed top-0 left-0 h-full w-72 sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out'>
        {/* Header */}
        <div className='bg-gradient-to-r from-[#FBB03B] to-[#f5a732] p-6 relative'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-all duration-200'
          >
            <X size={24} />
          </button>
          <div className='flex items-center gap-3 mt-2'>
            <div className='w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
              <User className='text-white' size={28} />
            </div>
            <div>
              <p className='text-white font-bold text-lg'>John Doe</p>
              <p className='text-white/80 text-sm capitalize'>{userRole}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className='p-4 flex flex-col h-[calc(100%-140px)]'>
          <div className='flex-1 space-y-2'>
            <Link
              to='/'
              onClick={onClose}
              className='flex items-center gap-4 hover:bg-gradient-to-r hover:from-[#FBB03B] hover:to-[#f5a732] p-4 rounded-xl cursor-pointer transition-all duration-200 group text-gray-700 hover:text-white'
            >
              <Home className='group-hover:text-white text-gray-600 transition-colors duration-200' size={22} />
              <span className='font-semibold text-base'>Home</span>
            </Link>

            <Link
              to='/profile'
              onClick={onClose}
              className='flex items-center gap-4 hover:bg-gradient-to-r hover:from-[#FBB03B] hover:to-[#f5a732] p-4 rounded-xl cursor-pointer transition-all duration-200 group text-gray-700 hover:text-white'
            >
              <User className='group-hover:text-white text-gray-600 transition-colors duration-200' size={22} />
              <span className='font-semibold text-base'>Profile</span>
            </Link>

            {isEducator && (
              <Link
                to='/dashboard'
                onClick={onClose}
                className='flex items-center gap-4 hover:bg-gradient-to-r hover:from-[#FBB03B] hover:to-[#f5a732] p-4 rounded-xl cursor-pointer transition-all duration-200 group text-gray-700 hover:text-white'
              >
                <LayoutDashboard className='group-hover:text-white text-gray-600 transition-colors duration-200' size={22} />
                <span className='font-semibold text-base'>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Logout Button at Bottom */}
          <div className='border-t border-gray-200 pt-4'>
            <button
              onClick={handleLogout}
              className='w-full flex items-center gap-4 hover:bg-red-500 p-4 rounded-xl cursor-pointer transition-all duration-200 group text-gray-700 hover:text-white'
            >
              <LogOut className='group-hover:text-white text-red-500 transition-colors duration-200' size={22} />
              <span className='font-semibold text-base group-hover:text-white text-red-500'>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideModal;