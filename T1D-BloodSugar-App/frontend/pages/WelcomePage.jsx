import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WelcomePage.css";

// welcomepage component
const WelcomePage = () => {
  const navigate = useNavigate();

  // handle login button click
  const handleLogin = () => {
    navigate("/login");
  };

  // handle signup button click
  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="branding">
          <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path d="M50 10c-10 0-20 10-20 20 0 20 20 40 20 40s20-20 20-40c0-10-10-20-20-20z" fill="#4CAF50"/>
            <circle cx="50" cy="30" r="3" fill="#ffffff"/>
            <circle cx="45" cy="35" r="3" fill="#ffffff"/>
            <circle cx="55" cy="35" r="3" fill="#ffffff"/>
            <circle cx="50" cy="40" r="3" fill="#ffffff"/>
            <line x1="50" y1="30" x2="45" y2="35" stroke="#ffffff" strokeWidth="2"/>
            <line x1="50" y1="30" x2="55" y2="35" stroke="#ffffff" strokeWidth="2"/>
            <line x1="45" y1="35" x2="50" y2="40" stroke="#ffffff" strokeWidth="2"/>
            <line x1="55" y1="35" x2="50" y2="40" stroke="#ffffff" strokeWidth="2"/>
          </svg>
          <h1>GlucoLog</h1>
        </div>
        <h2>Welcome to GlucoLog</h2>
        <p>Monitor and analyze your blood sugar levels with ease.</p>
        <div className="button-group">
          <button className="welcome-button" onClick={handleLogin}>Login</button>
          <button className="welcome-button" onClick={handleSignup}>Sign Up</button>
        </div>
      </div>
      <div className="background-elements">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
        <div className="circle circle4"></div>
        <div className="circle circle5"></div>
        <div className="circle circle6"></div>
        <div className="circle circle7"></div>
        <div className="circle circle8"></div>
        <div className="circle circle9"></div>
        <div className="circle circle10"></div>
        <div className="circle circle11"></div>
        <div className="circle circle12"></div>
        <div className="circle circle13"></div>
        <div className="circle circle14"></div>
        <div className="circle circle15"></div>
      </div>
    </div>
  );
};

export default WelcomePage;