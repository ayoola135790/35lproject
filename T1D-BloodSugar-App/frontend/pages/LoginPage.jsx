import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
// import "./LoginPage.css"; // Import CSS for styling

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
    navigate("/");
  };

  return (
    <div className="login-container">
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

      {/* Debugging: Show real-time input values */}
      <p>Email: {identifier}</p>
      <p>Password: {password}</p>
    </div>
  );
};

export default LoginPage;
