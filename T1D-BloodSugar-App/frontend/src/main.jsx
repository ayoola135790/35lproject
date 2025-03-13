import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WelcomePage';
import SignupPage from '../pages/SignupPage';
import GraphPage from '../pages/GraphPage';
import JournalPage from '../pages/JournalPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage'; 
import NewPasswordPage from '../pages/NewPasswordPage'; 

// Protected route component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedPort = localStorage.getItem('backendPort');
    if (savedPort) {
      window.backendPort = savedPort;
    }
    setIsInitialized(true);
  }, []);

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/new-password' element={<NewPasswordPage />} />
        <Route path='/graphpage' element={
          <ProtectedRoute>
            <GraphPage />
          </ProtectedRoute>
        } />
        <Route path='/journal' element={
          <ProtectedRoute>
            <JournalPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

