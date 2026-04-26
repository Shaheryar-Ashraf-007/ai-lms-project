import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axiosInstance from '../../lib/axiosInstance'

const BACKEND_URL = import.meta.env.VITE_API_URL || ""
const GEMINI_KEY = import.meta.env.GEMINI_API_KEY

const getThumbnail = (thumbnail) => {
  if (!thumbnail) return null
  if (thumbnail.startsWith('http') || thumbnail.startsWith('https')) return thumbnail
  const clean = thumbnail.startsWith('/') ? thumbnail : `/${thumbnail}`
  return `${BACKEND_URL}${clean}`
}

const LANG_FLAGS = {
  en: '🇺🇸', ur: '🇵🇰', ar: '🇸🇦', fr: '🇫🇷',
  es: '🇪🇸', de: '🇩🇪', zh: '🇨🇳', hi: '🇮🇳',
  tr: '🇹🇷', pt: '🇧🇷', ru: '🇷🇺', ja: '🇯🇵',
}
const LANG_NAMES = {
  en: 'English', ur: 'Urdu', ar: 'Arabic', fr: 'French',
  es: 'Spanish', de: 'German', zh: 'Chinese', hi: 'Hindi',
  tr: 'Turkish', pt: 'Portuguese', ru: 'Russian', ja: 'Japanese',
}

// ── Local keyword map — works without Gemini ──────────────────
const KEYWORD_MAP = [
  { patterns: ['ویب ڈویلپمنٹ', 'web development', 'ویب', 'website', 'ویب سائٹ'], keyword: 'web development' },
  { patterns: ['mern', 'mern stack', 'مرن اسٹیک', 'مرن'], keyword: 'mern stack' },
  { patterns: ['data science', 'ڈیٹا سائنس', 'data sciences', 'data analyst', 'ڈیٹا سائنس'], keyword: 'data science' },
  { patterns: ['python', 'پائتھن', 'پایتھن', 'پایتون'], keyword: 'python' },
  { patterns: ['react', 'ری ایکٹ', 'reactjs', 'react js'], keyword: 'react' },
  { patterns: ['machine learning', 'مشین لرننگ', 'ml', 'artificial intelligence', 'آرٹیفیشل انٹیلیجنس'], keyword: 'machine learning' },
  { patterns: ['javascript', 'js', 'جاوا اسکرپٹ'], keyword: 'javascript' },
  { patterns: ['ui ux', 'ui/ux', 'graphic design', 'ڈیزائن', 'گرافک ڈیزائن'], keyword: 'ui ux design' },
  { patterns: ['node', 'nodejs', 'node.js', 'backend', 'بیک اینڈ'], keyword: 'nodejs' },
  { patterns: ['flutter', 'mobile app', 'موبائل ایپ', 'android', 'ios'], keyword: 'flutter' },
  { patterns: ['php', 'laravel', 'لاراول'], keyword: 'php' },
  { patterns: ['css', 'html', 'frontend', 'فرنٹ اینڈ', 'ایچ ٹی ایم ایل'], keyword: 'html css' },
  { patterns: ['sql', 'database', 'ڈیٹابیس', 'mysql', 'mongodb'], keyword: 'database' },
  { patterns: ['devops', 'docker', 'kubernetes', 'cloud', 'aws'], keyword: 'devops' },
  { patterns: ['cyber', 'security', 'hacking', 'ethical hacking', 'سیکیورٹی'], keyword: 'cyber security' },
  { patterns: ['blockchain', 'crypto', 'web3', 'بلاک چین'], keyword: 'blockchain' },
  { patterns: ['django', 'flask'], keyword: 'python' },
  { patterns: ['next', 'nextjs', 'next.js'], keyword: 'nextjs' },
  { patterns: ['vue', 'vuejs', 'angular'], keyword: 'javascript' },
  { patterns: ['اے آئی', 'ai', 'چیٹ جی پی ٹی'], keyword: 'artificial intelligence' },
]

const localKeywordExtract = (input) => {
  const lower = input.toLowerCase().trim()
  for (const entry of KEYWORD_MAP) {
    for (const pattern of entry.patterns) {
      if (lower.includes(pattern.toLowerCase())) {
        return entry.keyword
      }
    }
  }
  return null
}

const SearchWithAI = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [previousSearches, setPreviousSearches] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [geminiLoading, setGeminiLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [imgErrors, setImgErrors] = useState({})
  const [detectedLang, setDetectedLang] = useState(null)
  const [extractedKeyword, setExtractedKeyword] = useState('')
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ai_searches') || '[]')
    setPreviousSearches(stored)
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setQuery(q); runSearch(q) }
  }, [])

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) {
      setVoiceSupported(true)
      const rec = new SR()
      rec.continuous = false
      rec.interimResults = true
      rec.lang = ''
      rec.onresult = (e) => {
        const text = Array.from(e.results).map(r => r[0].transcript).join('')
        setQuery(text)
      }
      rec.onend = () => setIsListening(false)
      rec.onerror = () => setIsListening(false)
      recognitionRef.current = rec
    }
  }, [])

  const toggleVoice = () => {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // ── Keyword extractor: local map → Gemini → raw input ─────
  const extractKeyword = async (userInput) => {
    const trimmed = userInput.trim()

    // 1. Pure English input — use as-is
    const isEnglish = /^[a-zA-Z0-9\s\-\.\/]+$/.test(trimmed)
    if (isEnglish) {
      return { keyword: trimmed, lang: 'en' }
    }

    // 2. Local keyword map — instant, no API
    const localMatch = localKeywordExtract(trimmed)
    if (localMatch && !GEMINI_KEY) {
      setStatusMsg(`Matched locally → "${localMatch}"`)
      return { keyword: localMatch, lang: 'ur' }
    }

    // 3. Gemini API — for unlisted keywords
    if (GEMINI_KEY) {
      setGeminiLoading(true)
      setStatusMsg('Detecting language with Gemini…')
      try {
        const prompt = `You are a multilingual course search assistant.
User input: "${trimmed}"
Extract the English course keyword and detect language.
Return ONLY raw JSON, no markdown: {"keyword": "<english keyword>", "lang": "<2-letter ISO code>"}
Examples:
- "مجھے ویب ڈویلپمنٹ سیکھنی ہے" → {"keyword":"web development","lang":"ur"}
- "مجھے مرن اسٹیک سیکھنا ہے" → {"keyword":"mern stack","lang":"ur"}
- "ڈیٹا سائنس سیکھنی ہے" → {"keyword":"data science","lang":"ur"}
- "Python सीखना है" → {"keyword":"python","lang":"hi"}
- "أريد تعلم React" → {"keyword":"react","lang":"ar"}
- "apprendre machine learning" → {"keyword":"machine learning","lang":"fr"}`

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0, maxOutputTokens: 60 }
            })
          }
        )
        const data = await res.json()
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const clean = raw.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)

        if (parsed.keyword) {
          setGeminiLoading(false)
          setStatusMsg(`Gemini detected: ${LANG_NAMES[parsed.lang] || parsed.lang} → "${parsed.keyword}"`)
          return { keyword: parsed.keyword.toLowerCase().trim(), lang: parsed.lang || 'ur' }
        }
      } catch (err) {
        console.error('Gemini error:', err)
        setGeminiLoading(false)
      }
    }

    // 4. Local map as last resort
    if (localMatch) {
      setStatusMsg(`Matched locally → "${localMatch}"`)
      return { keyword: localMatch, lang: 'ur' }
    }

    // 5. Give up — raw input
    setStatusMsg('Could not detect — try typing in English')
    return { keyword: trimmed, lang: 'unknown' }
  }

  // ── Main search ────────────────────────────────────────────
  const runSearch = async (overrideQuery) => {
    const rawInput = (overrideQuery || query).trim()
    if (!rawInput) return

    setLoading(true)
    setSearched(false)
    setResults([])
    setDetectedLang(null)
    setExtractedKeyword('')
    setStatusMsg('')
    setGeminiLoading(false)

    // Save to history
    const stored = JSON.parse(localStorage.getItem('ai_searches') || '[]')
    const updated = [rawInput, ...stored.filter(s => s !== rawInput)].slice(0, 6)
    localStorage.setItem('ai_searches', JSON.stringify(updated))
    setPreviousSearches(updated)

    try {
      // Step 1 — extract English keyword
      const { keyword, lang } = await extractKeyword(rawInput)
      setDetectedLang(lang)
      setExtractedKeyword(keyword)

      // Step 2 — search backend
      const res = await axiosInstance.post('/course/search', { input: keyword })
      const courses = Array.isArray(res.data) ? res.data : []
      setResults(courses)
      setSearched(true)
    } catch (err) {
      console.error('Search failed:', err)
      setResults([])
      setSearched(true)
    } finally {
      setLoading(false)
      setGeminiLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runSearch() }
  }

  const handlePreviousClick = (s) => { setQuery(s); runSearch(s) }

  const handleDeleteSearch = (e, s) => {
    e.stopPropagation()
    const updated = previousSearches.filter(p => p !== s)
    setPreviousSearches(updated)
    localStorage.setItem('ai_searches', JSON.stringify(updated))
  }

  const handleClearAll = () => {
    setPreviousSearches([])
    localStorage.removeItem('ai_searches')
  }

  const isProcessing = loading || geminiLoading

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 pb-20">

      {/* ── TOP NAV ── */}
      <div className="max-w-3xl mx-auto pt-6 mb-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          ← Back to Courses
        </button>
      </div>

      {/* ── HEADER ── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 mb-4">
          <span className="text-blue-500">🌐</span>
          <span className="text-blue-700 text-xs font-bold uppercase tracking-widest">Multilingual Search</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Search in <span className="text-blue-600">any language</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Speak or type in Urdu, Arabic, Hindi, French — AI finds the right courses
        </p>
        {/* Language badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {Object.entries(LANG_FLAGS).map(([code, flag]) => (
            <span key={code}
              className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${
                detectedLang === code
                  ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-md'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}>
              {flag} {LANG_NAMES[code]}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-5">

        {/* ── SEARCH CARD ── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/60 border border-blue-100 overflow-hidden">

          {/* Card header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-base">🌐</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Multilingual Course Search</p>
              <p className="text-blue-200 text-xs">Understands Urdu, Arabic, Hindi, French & more</p>
            </div>
            {geminiLoading && (
              <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5">
                <svg className="w-3 h-3 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span className="text-white text-xs font-bold">Translating…</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-5">
            <div className={`flex items-start gap-3 border-2 rounded-2xl p-4 transition-all duration-200 ${
              isListening
                ? 'border-red-400 bg-red-50'
                : 'border-gray-200 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-md focus-within:shadow-blue-100'
            }`}>
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type in any language... مجھے ویب ڈویلپمنٹ سیکھنی ہے / Python सीखना है / apprendre React..."
                  rows={3}
                  dir="auto"
                  className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none resize-none leading-relaxed font-medium"
                />

                {/* Status / detected language */}
                {(detectedLang || statusMsg) && !isProcessing && (
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {detectedLang && detectedLang !== 'en' && (
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                        {LANG_FLAGS[detectedLang] || '🌐'} {LANG_NAMES[detectedLang] || detectedLang}
                      </span>
                    )}
                    {extractedKeyword && detectedLang !== 'en' && (
                      <>
                        <span className="text-xs text-gray-400">→ searched as:</span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
                          "{extractedKeyword}"
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Voice button */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                {voiceSupported ? (
                  <button onClick={toggleVoice}
                    title={isListening ? 'Stop' : 'Speak in any language'}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isListening
                        ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}>
                    {isListening ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="6" width="12" height="12" rx="2"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="23"/>
                        <line x1="8" y1="23" x2="16" y2="23"/>
                      </svg>
                    )}
                  </button>
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-gray-300 cursor-not-allowed text-lg">🎤</div>
                )}
                <span className="text-xs text-gray-300">{isListening ? '🔴' : '🎤'}</span>
              </div>
            </div>

            {/* Listening waveform */}
            {isListening && (
              <div className="flex items-center gap-2 mt-2 px-1">
                <div className="flex gap-0.5 items-end">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1 bg-red-400 rounded-full animate-bounce"
                      style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.1}s` }}/>
                  ))}
                </div>
                <span className="text-xs font-semibold text-red-500">Listening in any language…</span>
              </div>
            )}

            {/* Quick prompts — Urdu + English */}
            <div className="mt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Try these</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '🇵🇰 ویب ڈویلپمنٹ', value: 'مجھے ویب ڈویلپمنٹ سیکھنی ہے' },
                  { label: '🇵🇰 ڈیٹا سائنس', value: 'ڈیٹا سائنس سیکھنی ہے' },
                  { label: '🇵🇰 مرن اسٹیک', value: 'مجھے مرن اسٹیک سیکھنا ہے' },
                  { label: '🇺🇸 Web Development', value: 'web development' },
                  { label: '🇺🇸 Data Science', value: 'data science' },
                  { label: '🇺🇸 MERN Stack', value: 'mern stack' },
                ].map(p => (
                  <button key={p.value}
                    onClick={() => { setQuery(p.value); setTimeout(() => runSearch(p.value), 0) }}
                    className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-full px-3 py-1.5 transition-all">
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={() => runSearch()}
              disabled={!query.trim() || isProcessing}
              className="mt-5 w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5"
            >
              {geminiLoading ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>Detecting language…</>
              ) : loading ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>Searching…</>
              ) : (
                <><span>🌐</span> Search in Any Language</>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Press <kbd className="bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 font-mono">Enter</kbd> to search
            </p>
          </div>
        </div>

        {/* ── RESULTS HEADER ── */}
        {searched && (
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-gray-800">Search Results</h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                results.length > 0
                  ? 'text-blue-600 bg-blue-50 border-blue-100'
                  : 'text-gray-400 bg-gray-50 border-gray-200'
              }`}>
                {results.length} found
              </span>
              {extractedKeyword && (
                <span className="text-xs text-gray-400">
                  for "<span className="font-semibold text-gray-600">{extractedKeyword}</span>"
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── NO RESULTS ── */}
        {searched && results.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <span className="text-5xl block mb-3">🔍</span>
            <h3 className="text-lg font-bold text-gray-700 mb-1">No courses found</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-1">
              Searched for: "<span className="font-semibold text-gray-600">{extractedKeyword || query}</span>"
            </p>
            <p className="text-gray-300 text-xs mb-4">Try: web development · data science · mern stack · python</p>
            <button onClick={() => navigate('/')}
              className="bg-blue-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
              Browse All Courses
            </button>
          </div>
        )}

        {/* ── RESULTS GRID ── */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((course, i) => {
              const thumb = getThumbnail(course.thumbnail)
              return (
                <div key={course._id}
                  onClick={() => navigate(`/viewCourses/${course._id}`)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group overflow-hidden flex">
                  <div className="w-28 flex-shrink-0 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
                    {thumb && !imgErrors[course._id] ? (
                      <img src={thumb} alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImgErrors(prev => ({ ...prev, [course._id]: true }))}/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center min-h-[90px]">
                        <span className="text-3xl">🎓</span>
                      </div>
                    )}
                    <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                      {i + 1}
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-1 min-w-0">
                    {course.category && (
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-0.5">{course.category}</span>
                    )}
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug mb-1">{course.title}</h3>
                    {course.level && <span className="text-xs text-gray-400 font-medium mb-1">{course.level}</span>}
                    {course.description && <p className="text-xs text-gray-400 line-clamp-1 mb-1">{course.description}</p>}
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <span className="text-base font-bold text-blue-600">${course.price ?? 0}</span>
                      <span className="text-xs text-gray-400">{course.enrolledStudents?.length || 0} enrolled</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── RECENT SEARCHES ── */}
        {previousSearches.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">🕐</span>
                <p className="text-sm font-bold text-gray-700">Recent Searches</p>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                  {previousSearches.length}
                </span>
              </div>
              <button onClick={handleClearAll}
                className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors">
                Clear all
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {previousSearches.map((s, i) => (
                <div key={i} onClick={() => handlePreviousClick(s)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 cursor-pointer group transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <p className="flex-1 text-sm text-gray-600 group-hover:text-blue-700 font-medium truncate transition-colors" dir="auto">{s}</p>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); setQuery(s); inputRef.current?.focus() }}
                      className="w-6 h-6 rounded-md hover:bg-blue-100 flex items-center justify-center text-blue-400 hover:text-blue-600 transition-colors">↗</button>
                    <button onClick={e => handleDeleteSearch(e, s)}
                      className="w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors text-xs">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EMPTY HISTORY ── */}
        {previousSearches.length === 0 && !searched && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center">
            <span className="text-3xl block mb-2">🌐</span>
            <p className="text-sm font-semibold text-gray-400">No recent searches yet</p>
            <p className="text-xs text-gray-300 mt-1">Try searching in any language</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchWithAI