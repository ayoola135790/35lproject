import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LoginPage from '../pages/LoginPage'
import WelcomePage from '../pages/WelcomePage'
import SignupPage from '../pages/SignupPage'
import HomePage from '../pages/HomePage'
import GraphPage from '../pages/GraphPage'
import { BrowserRouter, Routes, Route } from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/graphpage' element={<GraphPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
