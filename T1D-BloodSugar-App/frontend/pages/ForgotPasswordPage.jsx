import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [username, setUsername] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const port = localStorage.getItem('backendPort') || 5000;
      const response = await fetch(`http://localhost:${port}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: username, securityQuestion, securityAnswer }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('resetUsername', username);
        navigate("/new-password");
      } else {
        setError(data.error || "User not found or incorrect security answer");
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
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

        <h2>Forgot Password</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {showSecurityQuestion && (
            <>
              <input
                type="text"
                placeholder="Security Question"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Security Answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
            </>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Reset Password"}
          </button>
          <button 
            type="button" 
            onClick={() => setShowSecurityQuestion(true)} 
            style={{ marginTop: '10px' }}
          >
            Create Security Question
          </button>
        </form>

        <p className="back-to-login">
          Remembered your password?{" "}
          <span onClick={() => navigate("/login")} className="clickable-text">Login</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;