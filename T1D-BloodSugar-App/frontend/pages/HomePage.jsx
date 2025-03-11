import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <p>sup</p>

      {/* Clickable text that routes to the SignUp page */}
      <Link to="/login">
        <p style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}>
          Route
        </p>
      </Link>
    </>
  );
}

export default HomePage;
