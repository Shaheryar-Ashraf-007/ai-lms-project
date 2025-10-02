import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  
  <Provider store={store}>
  <div className="bg-[#F9F9F9] h-screen w-full">
    <App />
    </div>
  </Provider>
  </BrowserRouter>
)
