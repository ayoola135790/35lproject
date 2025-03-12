import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import "../styles/SignupPage.css";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Can be email, phone, or username
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signing up with:", name, identifier, password);
    // TODO: Send signup data to backend
    navigate("/login");
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
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
        <h2>Sign Up</h2>
        <p className="note">
          This app is tied to Sugarmate. Please keep your sign-in information consistent so that we can log in to that account and analyze your blood sugar data.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {/* Login Link */}
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
