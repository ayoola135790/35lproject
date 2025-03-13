import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WelcomePage';
import SignupPage from '../pages/SignupPage';
import GraphPage from '../pages/GraphPage';
import JournalPage from '../pages/JournalPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage'; // Import ForgotPasswordPage
import NewPasswordPage from '../pages/NewPasswordPage'; // Import NewPasswordPage

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/graphpage' element={<GraphPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/journal' element={<JournalPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} /> {/* Forgot Password Page */}
        <Route path='/new-password' element={<NewPasswordPage />} /> {/* New Password Page */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);