import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NewPasswordPage.css";

const NewPasswordPage = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Resetting password for:", username);
    console.log("New Password:", newPassword);

    // TODO: Send username and new password to the backend for reset
    alert("Password reset successful!");
    navigate("/login"); // Redirect to login page after successful reset
  };

  return (
    <div className="new-password-page">
      <div className="new-password-container">
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

        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordPage;