import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <h1>Welcome to Our WebApp!</h1>
      <p>We're glad you're here. Please sign in or create a new account to get started.</p>

      {/* Navigation links to the Login and Sign Up pages */}
      <div className="auth-links">
        <Link to="/login">
          <button className="auth-button">Login</button>
        </Link>
        <Link to="/signup">
          <button className="auth-button">Sign Up</button>
        </Link>
        <Link to="/graphpage">
          <button className="auth-button">Temp</button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;