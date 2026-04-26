import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Edit2, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Navigation
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const Profile = () => {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    location: userData?.location || '',
    description: userData?.description || '',
    joinDate: userData?.joinDate || new Date().toISOString().split('T')[0]
  });

  const fileInputRef = useRef(null);

  // Enrolled courses from userData
  const enrolledCourses = userData?.enrolledCourses || [];

  // Calculate stats
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(c => c.progress === 100).length;
  const inProgressCourses = enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length;

  // Update formData when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        description: userData.description || '',
        joinDate: userData.joinDate || new Date().toISOString().split('T')[0]
      });
      
      // Set profile image if exists
      if (userData.photoUrl) {
        setProfileImage(userData.photoUrl);
      }
    }
  }, [userData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getLocationFromGPS = () => {
    setLoadingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Using OpenStreetMap's Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            {
              headers: {
                'User-Agent': 'ProfileApp/1.0'
              }
            }
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch location');
          }
          
          const data = await response.json();
          
          // Extract city and country from the response
          const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
          const country = data.address.country || '';
          const locationString = city && country ? `${city}, ${country}` : city || country || 'Unknown Location';
          
          setFormData({
            ...formData,
            location: locationString
          });
          setLoadingLocation(false);
        } catch (error) {
          console.error('Error fetching location:', error);
          alert('Failed to get location details. Please enter manually.');
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to retrieve your location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        
        alert(errorMessage);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      alert('Email is required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Phone validation (optional, only if provided)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[+]?[\d\s-()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        alert('Please enter a valid phone number');
        return;
      }
    }

    try {
      // Prepare updated data
      const updatedData = {
        ...userData,
        ...formData,
        photoUrl: profileImage || userData?.photoUrl || null,
        updatedAt: new Date().toISOString()
      };

      // Dispatch to Redux (will automatically save to localStorage)
      dispatch(setUserData(updatedData));
      
      setIsEditing(false);
      
      console.log('Profile updated successfully');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reset form to original userData
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        description: userData.description || '',
        joinDate: userData.joinDate || new Date().toISOString().split('T')[0]
      });
      setProfileImage(userData.photoUrl || null);
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-[#FBB03B] via-[#f5a732] to-[#e89f2f] relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-20 mb-4">
              <div className="relative inline-block">
                <div className="w-40 h-40 rounded-full border-8 border-white bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden shadow-xl">
                  {profileImage || userData?.photoUrl ? (
                    <img 
                      src={profileImage || userData?.photoUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-[#FBB03B] text-white p-3 rounded-full shadow-lg hover:bg-[#e89f2f] transition-all duration-200 hover:scale-110"
                  >
                    <Camera size={20} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Edit/Save Buttons */}
              <div className="mt-4 sm:mt-0 flex gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#FBB03B] to-[#f5a732] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      <Save size={18} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FBB03B] focus:outline-none transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FBB03B] focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+92 300 1234567"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FBB03B] focus:outline-none transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter your location"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FBB03B] focus:outline-none transition-colors duration-200"
                      />
                      <button
                        onClick={getLocationFromGPS}
                        disabled={loadingLocation}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Navigation size={18} className={loadingLocation ? 'animate-spin' : ''} />
                        {loadingLocation ? 'Getting...' : 'GPS'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FBB03B] focus:outline-none transition-colors duration-200 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-800">{formData.name || 'User Name'}</h1>
                  <p className="text-gray-600 text-lg">{formData.description || 'No description provided'}</p>
                </>
              )}

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-[#FBB03B]/10 rounded-lg flex items-center justify-center">
                    <Mail className="text-[#FBB03B]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-sm font-semibold text-gray-700">{formData.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-[#FBB03B]/10 rounded-lg flex items-center justify-center">
                    <Phone className="text-[#FBB03B]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <p className="text-sm font-semibold text-gray-700">{formData.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-[#FBB03B]/10 rounded-lg flex items-center justify-center">
                    <MapPin className="text-[#FBB03B]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Location</p>
                    <p className="text-sm font-semibold text-gray-700">{formData.location || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-[#FBB03B]/10 rounded-lg flex items-center justify-center">
                    <Calendar className="text-[#FBB03B]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Joined</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {formData.joinDate ? new Date(formData.joinDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FBB03B]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalCourses}</p>
              </div>
              <div className="w-14 h-14 bg-[#FBB03B]/10 rounded-xl flex items-center justify-center">
                <BookOpen className="text-[#FBB03B]" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{completedCourses}</p>
              </div>
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Award className="text-green-500" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{inProgressCourses}</p>
              </div>
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-blue-500" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        {enrolledCourses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <BookOpen className="text-[#FBB03B]" size={28} />
                Enrolled Courses
              </h2>
              <span className="bg-[#FBB03B]/10 text-[#FBB03B] px-4 py-2 rounded-full font-semibold text-sm">
                {enrolledCourses.length} Courses
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#FBB03B]/30"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/400x300?text=Course+Image'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {course.category && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                        {course.category}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#FBB03B] transition-colors duration-200">
                      {course.title}
                    </h3>
                    
                    {course.instructor && (
                      <p className="text-sm text-gray-600 mb-4">By {course.instructor}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      {course.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {course.duration}
                        </span>
                      )}
                      {course.enrolled && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {course.enrolled}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700">Progress</span>
                        <span className="font-bold text-[#FBB03B]">{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#FBB03B] to-[#f5a732] h-full rounded-full transition-all duration-500"
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <button className="w-full mt-4 bg-gradient-to-r from-[#FBB03B] to-[#f5a732] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for No Courses */}
        {enrolledCourses.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="text-gray-400" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Courses Yet</h3>
            <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course!</p>
            <button className="bg-gradient-to-r from-[#FBB03B] to-[#f5a732] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;