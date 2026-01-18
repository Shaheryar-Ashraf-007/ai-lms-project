import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  TrendingUp,
  Award,
  ChevronDown,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { enrollCourse } from '../redux/userSlice';

const EnrollCourse = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const enrolledCourseIds = userData?.enrolledCourses?.map(c => c.id) || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Sample courses data
  const allCourses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      description: 'Master web development with HTML, CSS, JavaScript, React, Node.js and more',
      instructor: 'Dr. Angela Yu',
      category: 'Web Development',
      level: 'Beginner',
      duration: '54 hours',
      enrolled: '245,000',
      rating: 4.7,
      reviews: 89000,
      price: '$89.99',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop',
      lessons: 156,
      certificate: true
    },
    {
      id: 2,
      title: 'Python for Data Science and Machine Learning',
      description: 'Learn Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, TensorFlow',
      instructor: 'Jose Portilla',
      category: 'Data Science',
      level: 'Intermediate',
      duration: '25 hours',
      enrolled: '180,000',
      rating: 4.6,
      reviews: 65000,
      price: '$94.99',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=300&fit=crop',
      lessons: 98,
      certificate: true
    },
    {
      id: 3,
      title: 'Advanced React and Redux',
      description: 'Master React and Redux with advanced patterns, testing, and performance optimization',
      instructor: 'Maximilian Schwarzmüller',
      category: 'Web Development',
      level: 'Advanced',
      duration: '40 hours',
      enrolled: '120,000',
      rating: 4.8,
      reviews: 45000,
      price: '$79.99',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop',
      lessons: 124,
      certificate: true
    },
    {
      id: 4,
      title: 'UI/UX Design Masterclass',
      description: 'Learn user interface and user experience design from scratch with Figma',
      instructor: 'Daniel Walter Scott',
      category: 'Design',
      level: 'Beginner',
      duration: '32 hours',
      enrolled: '95,000',
      rating: 4.7,
      reviews: 38000,
      price: '$84.99',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
      lessons: 87,
      certificate: true
    },
    {
      id: 5,
      title: 'Digital Marketing Complete Course',
      description: 'Master digital marketing with SEO, social media, email marketing and analytics',
      instructor: 'Rob Percival',
      category: 'Marketing',
      level: 'Beginner',
      duration: '28 hours',
      enrolled: '140,000',
      rating: 4.5,
      reviews: 52000,
      price: '$74.99',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      lessons: 105,
      certificate: true
    },
    {
      id: 6,
      title: 'Mobile App Development with Flutter',
      description: 'Build beautiful native mobile apps for iOS and Android with Flutter and Dart',
      instructor: 'Angela Yu',
      category: 'Mobile Development',
      level: 'Intermediate',
      duration: '45 hours',
      enrolled: '110,000',
      rating: 4.7,
      reviews: 42000,
      price: '$89.99',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop',
      lessons: 142,
      certificate: true
    },
    {
      id: 7,
      title: 'AWS Certified Solutions Architect',
      description: 'Pass the AWS Solutions Architect exam and master cloud computing',
      instructor: 'Stephane Maarek',
      category: 'Cloud Computing',
      level: 'Advanced',
      duration: '38 hours',
      enrolled: '165,000',
      rating: 4.8,
      reviews: 67000,
      price: '$99.99',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
      lessons: 156,
      certificate: true
    },
    {
      id: 8,
      title: 'Graphic Design Fundamentals',
      description: 'Master Adobe Photoshop, Illustrator, and InDesign for professional design',
      instructor: 'Lindsay Marsh',
      category: 'Design',
      level: 'Beginner',
      duration: '22 hours',
      enrolled: '88,000',
      rating: 4.6,
      reviews: 34000,
      price: '$69.99',
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&h=300&fit=crop',
      lessons: 76,
      certificate: true
    }
  ];

  const categories = ['All', 'Web Development', 'Data Science', 'Design', 'Marketing', 'Mobile Development', 'Cloud Computing'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter courses
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleEnroll = (course) => {
    if (enrolledCourseIds.includes(course.id)) {
      alert('You are already enrolled in this course!');
      return;
    }

    dispatch(enrollCourse({
      ...course,
      progress: 0,
      enrolledAt: new Date().toISOString()
    }));

    alert(`Successfully enrolled in ${course.title}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FBB03B] via-[#f5a732] to-[#e89f2f] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Explore Our Courses
              </h1>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Discover world-class courses taught by industry experts. Learn at your own pace and advance your career with our comprehensive learning platform. Join thousands of students already transforming their lives.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
                  <div className="text-3xl font-bold">{allCourses.length}+</div>
                  <div className="text-sm">Courses Available</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
                  <div className="text-3xl font-bold">100K+</div>
                  <div className="text-sm">Active Students</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
                  <div className="text-3xl font-bold">4.7★</div>
                  <div className="text-sm">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <BookOpen size={120} className="text-white" />
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-2xl">
                  <Award className="text-[#FBB03B]" size={32} />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-2xl">
                  <TrendingUp className="text-green-500" size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FBB03B] focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <Filter size={20} />
              Filters
              <ChevronDown size={18} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FBB03B] focus:outline-none transition-colors bg-white cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FBB03B] focus:outline-none transition-colors bg-white cursor-pointer"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FBB03B] focus:outline-none transition-colors bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FBB03B] focus:outline-none transition-colors bg-white"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Info */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
          </h2>
          
          {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLevel('All');
                setSearchQuery('');
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X size={18} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              
              return (
                <div
                  key={course.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#FBB03B]/30"
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                      {course.level}
                    </div>
                    {course.certificate && (
                      <div className="absolute top-3 right-3 bg-[#FBB03B]/95 backdrop-blur-sm p-2 rounded-full">
                        <Award className="text-white" size={16} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="bg-[#FBB03B] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#FBB03B] transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 font-bold text-gray-800">{course.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({course.reviews.toLocaleString()} reviews)</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      By <span className="font-semibold">{course.instructor}</span>
                    </p>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{course.enrolled}</span>
                      </div>
                    </div>

                    {/* Price and Enroll */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">{course.price}</span>
                      </div>
                      <button
                        onClick={() => handleEnroll(course)}
                        disabled={isEnrolled}
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                          isEnrolled
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#FBB03B] to-[#f5a732] text-white hover:shadow-lg hover:scale-105'
                        }`}
                      >
                        {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-gray-400" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Courses Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLevel('All');
                setSearchQuery('');
              }}
              className="bg-gradient-to-r from-[#FBB03B] to-[#f5a732] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollCourse;