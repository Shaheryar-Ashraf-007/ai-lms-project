import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <div className="bg-[#F9F9F9] h-screen w-full">
    <App />
    </div>
  </BrowserRouter>
)
