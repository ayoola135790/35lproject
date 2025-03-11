import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

function HomePage() {
  return (
    <>
      <p>Want to have both login pages lead to this page</p>
      <h1>Want this page to have the graph & option to analyze data</h1>
      <p>Show output at the bottom -- then link to see more output/journal page</p>

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

export default HomePage
