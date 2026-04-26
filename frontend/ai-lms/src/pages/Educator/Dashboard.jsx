import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { BookOpen, TrendingUp, Users, DollarSign, Plus, BarChart3, Award } from "lucide-react"

const Dashboard = () => {
  const {userData} = useSelector((state) => state.user)
  const navigate = useNavigate()

  const stats = [
    { icon: BookOpen, label: "Total Courses", value: "10", color: "bg-blue-500" },
    { icon: Users, label: "Total Students", value: "20", color: "bg-purple-500" },
    { icon: DollarSign, label: "Total Revenue", value: "$100", color: "bg-green-500" },
    { icon: Award, label: "Completion Rate", value: "30%", color: "bg-orange-500" }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img 
                src={userData?.photoUrl || `https://ui-avatars.com/api/?name=${userData?.name || "User"}&size=128&background=random`} 
                alt="Educator" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
              />
              <div className="absolute -bottom-0 -right-0 bg-green-400 w-8 h-8 rounded-full border-4 border-white"></div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back, {userData?.name || "Educator"}! 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                {userData?.description || "Ready to inspire and educate your students today"}
              </p>
            </div>

            <button 
              onClick={() => navigate("/courses")}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              Create Course
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-xl shadow-md`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Revenue Overview
              </h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center space-y-3">
                <BarChart3 className="w-16 h-16 mx-auto text-gray-300" />
                <p>No data available yet</p>
                <p className="text-sm">Start creating courses to see your revenue</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="text-center py-12 text-gray-400">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                <p>No recent activity</p>
                <p className="text-sm mt-2">Your course activity will appear here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate("/courses")}
              className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 text-gray-600 hover:text-indigo-600 font-medium"
            >
              + Create New Course
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-gray-600 hover:text-purple-600 font-medium">
              + Add Content
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-gray-600 hover:text-green-600 font-medium">
              + View Analytics
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard