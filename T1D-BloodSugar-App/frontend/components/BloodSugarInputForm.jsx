import React, { useState, useEffect } from "react";
import "./BloodSugarInputForm.css";

const BloodSugarInputForm = ({ onSubmitSuccess }) => {
  const [bloodSugar, setBloodSugar] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimestamp(getCurrentDateTime());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    console.log("Form submission values:", { 
      bloodSugar, 
      timestamp, 
      bloodSugarEmpty: !bloodSugar, 
      timestampEmpty: !timestamp 
    });
    
    if (!bloodSugar) {
      setError("Please provide a blood sugar level");
      return;
    }

    if (!timestamp) {
      setError("Please provide a timestamp");
      return;
    }

    try {
      setLoading(true);
      const port = localStorage.getItem('backendPort') || 5000;
      
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError("User not logged in. Please log in again.");
        return;
      }
      
      const user = JSON.parse(userStr);
      if (!user || !user.id) {
        setError("Invalid user data. Please log in again.");
        return;
      }
      
      const userId = user.id;
      
      console.log("Sending request to:", `http://localhost:${port}/api/blood-sugar-data`);
      console.log("Request payload:", {
        userId,
        bloodSugarLevel: parseInt(bloodSugar),
        timestamp
      });
      
      const response = await fetch(`http://localhost:${port}/api/blood-sugar-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          bloodSugarLevel: parseInt(bloodSugar),
          timestamp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server response error:", data);
        throw new Error(data.error || 'Failed to save blood sugar data');
      }

      console.log("Success response:", data);
      setBloodSugar("");
      setTimestamp(getCurrentDateTime());
      onSubmitSuccess && onSubmitSuccess();
    } catch (err) {
      console.error("Error saving blood sugar data:", err);
      setError(err.message || "Failed to save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="blood-sugar-input-form">
      <h3>Add Blood Sugar Reading</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bloodSugar">Blood Sugar Level (mg/dL):</label>
          <input
            type="number"
            id="bloodSugar"
            value={bloodSugar}
            onChange={(e) => setBloodSugar(e.target.value)}
            min="0"
            max="500"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="timestamp">Date and Time:</label>
          <input
            type="datetime-local"
            id="timestamp"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Reading"}
        </button>
      </form>
    </div>
  );
};

export default BloodSugarInputForm;