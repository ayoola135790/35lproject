import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LoginPage from '../pages/LoginPage'
import WelcomePage from '../pages/WelcomePage'
import SignupPage from '../pages/SignupPage'
import GraphPage from '../pages/GraphPage'
import JournalPage from '../pages/JournalPage'
import { BrowserRouter, Routes, Route } from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/graphpage' element={<GraphPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/journal' element={<JournalPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
