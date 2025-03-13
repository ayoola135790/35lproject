import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(""); // Can be email, phone, or username
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh
    console.log("Logging in with:", identifier, password);
    // Determine the type of identifier
    let identifierType = "username"; // Default to username

    if (identifier.includes("@")) {
        identifierType = "email"; // Email must contain '@'
    } 
    else if (/^\+?\d{10,15}$/.test(identifier)) {
        identifierType = "phone"; // Phone number contains only digits and may start with '+'
    }

    console.log(`Logging in with ${identifierType}: ${identifier}`); //TEST

    // TODO: Send identifierType along with credentials to backend
    navigate("/graphPage"); // Navigate to the graph page after login
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
        <h1> <a href="/"> GlucoLog</a> 
        </h1>
      </div>
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
        {/* Sign Up Link */}
      <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
    </div>
    </div>
  );
};

export default LoginPage;
