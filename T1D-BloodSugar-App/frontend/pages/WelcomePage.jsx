import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="branding">
          <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path d="M50 10c-10 0-20 10-20 20 0 20 20 40 20 40s20-20 20-40c0-10-10-20-20-20z" fill="#4CAF50"/>
            <circle cx="50" cy="30" r="3" fill="#ffffff"/>
            <circle cx="45" cy="35" r="3" fill="#ffffff"/>
            <circle cx="55" cy="35" r="3" fill="#ffffff"/>
            <circle cx="50" cy="40" r="3" fill="#ffffff"/>
            <line x1="50" y1="30" x2="45" y2="35" stroke="#ffffff" stroke-width="2"/>
            <line x1="50" y1="30" x2="55" y2="35" stroke="#ffffff" stroke-width="2"/>
            <line x1="45" y1="35" x2="50" y2="40" stroke="#ffffff" stroke-width="2"/>
            <line x1="55" y1="35" x2="50" y2="40" stroke="#ffffff" stroke-width="2"/>
          </svg>
          <h1>GlucoLog</h1>
        </div>
        <h2>Welcome to GlucoLog</h2>
        <p>Track and manage your blood sugar levels with ease.</p>
        <div className="button-group">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignup}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;