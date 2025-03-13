import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const possiblePorts = [5000, 5001, 5002];
      let response = null;
      let data = null;
      
      for (const port of possiblePorts) {
        try {
          console.log(`Trying to connect to auth login endpoint on port ${port}...`);
          response = await fetch(`http://localhost:${port}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              identifier,
              password
            }),
          });
          
          if (response.ok) {
            data = await response.json();
            window.backendPort = port;
            localStorage.setItem('backendPort', port);
            console.log(`Successfully connected to auth endpoint on port ${port}`);
            break;
          }
        } catch (err) {
          console.log(`Port ${port} not responding, trying next...`);
        }
      }
      
      if (data && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate("/graphPage");
      } else {
        setError(data?.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-page">
      <div className="login-container">
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
          <h1> <a href="/"> GlucoLog</a> </h1>
        </div>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email, Phone, or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
          <p className="forgot-password">
            <span className="clickable-text" onClick={handleForgotPassword}>Forgot password?</span>
          </p>
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
  );
};

export default LoginPage;