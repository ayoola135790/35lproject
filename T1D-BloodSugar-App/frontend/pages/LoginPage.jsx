import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
// import "./LoginPage.css"; // Import CSS for styling

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh
    console.log("Logging in with:", email, password);
    // TODO: Send data to backend API for authentication

    //
    navigate("/");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <p>Email: {email}</p>
      <p>Password: {password}</p>
    </div>
  );
};

export default LoginPage;
