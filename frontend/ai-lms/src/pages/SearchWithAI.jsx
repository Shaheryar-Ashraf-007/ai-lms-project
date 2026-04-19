import React from 'react'
import { useNavigate } from 'react-router-dom'

const SearchWithAI = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 pb-20">

      {/* ── TOP NAV ── */}
      <div className="max-w-3xl mx-auto pt-6 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Back to Courses
        </button>
      </div>

      {/* ── HEADER ── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 mb-4">
          <span className="text-blue-500">✦</span>
          <span className="text-blue-700 text-xs font-bold uppercase tracking-widest">AI Course Search</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          What do you want to{' '}
          <span className="text-blue-600">learn?</span>
        </h1>

        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Our AI searches all courses and reads the results out loud for you
        </p>
      </div>


      <div className="max-w-3xl mx-auto space-y-5">

        {/* ── SEARCH CARD ── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/60 border border-blue-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">✦</span>
            </div>

            <div className="flex-1">
              <p className="text-white font-bold text-sm">Search with AI</p>
              <p className="text-blue-200 text-xs">Results are read aloud by AI voice</p>
            </div>
          </div>

          {/* Input */}
          <div className="p-5">

            <div className="flex items-start gap-3 border-2 rounded-2xl p-4 border-gray-200 bg-gray-50">

              <textarea
                placeholder="e.g. I want to learn Python for data science from scratch..."
                rows={3}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none resize-none leading-relaxed font-medium"
              />

              <button
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600"
              >
                🎤
              </button>

            </div>

            {/* Quick prompts */}
            <div className="mt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Try asking
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  'Python for beginners',
                  'UI/UX design',
                  'Full stack web dev',
                  'Machine learning',
                  'React basics'
                ].map((item) => (
                  <button
                    key={item}
                    className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <button
              className="mt-5 w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-blue-200"
            >
              ✦ Search with AI
            </button>

          </div>
        </div>


        {/* ── AI SUMMARY ── */}
        <div className="bg-white border border-blue-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-blue-600 font-bold">✦</span>
          </div>

          <div className="flex-1">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
              AI Summary
            </p>

            <p className="text-sm text-gray-700">
              Here AI generated summary will appear
            </p>
          </div>

          <button
            className="text-xs font-bold px-3 py-1.5 rounded-xl border bg-blue-50 text-blue-600"
          >
            🔊 Read
          </button>
        </div>


        {/* ── RESULTS ── */}
        <div>

          <h2 className="text-base font-bold text-gray-800 mb-3">
            Search Results
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {[1,2,3,4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex"
              >

                <div className="w-28 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  🎓
                </div>

                <div className="p-3 flex-1">
                  <span className="text-xs font-bold text-blue-500 uppercase">
                    Category
                  </span>

                  <h3 className="text-sm font-bold text-gray-800">
                    Course Title Example
                  </h3>

                  <span className="text-xs text-gray-400">
                    Beginner
                  </span>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-blue-600">
                      $99
                    </span>

                    <span className="text-xs text-gray-400">
                      120 enrolled
                    </span>
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>


        {/* ── RECENT SEARCHES ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-700">
              Recent Searches
            </p>
          </div>

          {[1,2,3].map((item)=> (
            <div
              key={item}
              className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                🔍
              </div>

              <p className="text-sm text-gray-600">
                Example search query
              </p>
            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default SearchWithAI
