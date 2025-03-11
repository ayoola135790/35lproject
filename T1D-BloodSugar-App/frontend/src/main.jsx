import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LoginPage from '../pages/LoginPage'
import HomePage from '../pages/HomePage'
import GraphPage from '../pages/graphPage'
import { BrowserRouter, Routes, Route } from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/graph' element={<GraphPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
