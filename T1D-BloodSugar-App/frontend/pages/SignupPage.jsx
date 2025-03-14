import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import "../styles/SignupPage.css";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // can be email, phone, or username
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents page refresh
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    
    try {
      const possiblePorts = [5000, 5001, 5002];
      let response = null;
      let data = null;
      
      for (const port of possiblePorts) {
        try {
          console.log(`Trying to connect to auth endpoint on port ${port}...`);
          const url = `http://localhost:${port}/auth/signup`;
          console.log(`Attempting fetch to: ${url}`);
          
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              name, 
              identifier, 
              password,
              securityAnswer,
              confirmPassword: confirmPassword
            }),
          });
          
          console.log(`Response from ${port}:`, response.status, response.statusText);
          
          if (!response.ok) {
            console.log(`Server responded with error status: ${response.status}`);
            const errorText = await response.text();
            console.log(`Error details: ${errorText}`);
            throw new Error(`Server responded with status ${response.status}`);
          }

          data = await response.json();
          console.log(`Data received from ${port}:`, data);
          window.backendPort = port;
          localStorage.setItem('backendPort', port);
          console.log(`Successfully connected to auth endpoint on port ${port}`);
          break;
        } catch (err) {
          console.log(`Port ${port} not responding or error occurred: ${err.message}`);
        }
      }
      
      if (data) {
        if (data.success) {
          alert("Account created successfully! Please log in.");
          navigate("/login");
        } else {
          setError(data.error || 'Registration failed');
        }
      } else {
        throw new Error('Could not connect to backend on any port');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(`Connection error: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
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
            <line x1="50" y1="30" x2="45" y2="35" stroke="#ffffff" strokeWidth="2"/>
            <line x1="50" y1="30" x2="55" y2="35" stroke="#ffffff" strokeWidth="2"/>
            <line x1="45" y1="35" x2="50" y2="40" stroke="#ffffff" strokeWidth="2"/>
            <line x1="55" y1="35" x2="50" y2="40" stroke="#ffffff" strokeWidth="2"/>
          </svg>
          <h1> <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}> GlucoLog</a> </h1>
        </div>
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
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
          <input
            type="text"
            placeholder="Where did you grow up in your childhood?"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        {/* login link */}
        <p className="login-link">
          Already have an account? <a href="/login" style={{ fontWeight: 'bold' }}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
