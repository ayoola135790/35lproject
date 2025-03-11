import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <p>sup</p>

      {/* Navigation links */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/login">
          <p style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}>
            Login
          </p>
        </Link>
        
        <Link to="/graph">
          <p style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}>
            Blood Sugar Analysis
          </p>
        </Link>
      </div>
    </>
  );
}

export default HomePage;
