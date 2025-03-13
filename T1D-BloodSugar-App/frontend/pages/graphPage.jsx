import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import BloodSugarInputForm from "../components/BloodSugarInputForm";
import "../styles/graphPage.css";

function GraphPage() {
  const [bloodSugarData, setBloodSugarData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [analysisResult, setAnalysisResult] = useState("Click the button above to analyze the blood sugar data.");
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("all"); // "all", "1d", "1w", or "1m"
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBloodSugarData();
  }, []);

  useEffect(() => {
    if (bloodSugarData.length > 0) {
      filterDataByTimeRange();
    }
  }, [bloodSugarData, timeRange]);

  useEffect(() => {
    if (filteredData.length > 0 && chartRef.current) {
      updateChart();
    }
  }, [filteredData]);

  const fetchBloodSugarData = async () => {
    try {
      const savedPort = localStorage.getItem('backendPort');
      const userId = JSON.parse(localStorage.getItem('user')).id;
      
      if (savedPort) {
        try {
          const response = await fetch(`http://localhost:${savedPort}/api/blood-sugar-data/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setBloodSugarData(data);
            return;
          }
        } catch (err) {
          console.log(`Saved port ${savedPort} not responding, trying others...`);
        }
      }
      
      const possiblePorts = [5000, 5001, 5002];
      let data = null;
      
      for (const port of possiblePorts) {
        try {
          console.log(`Trying to connect to backend on port ${port}...`);
          const response = await fetch(`http://localhost:${port}/api/blood-sugar-data/${userId}`);
          if (response.ok) {
            data = await response.json();
            window.backendPort = port;
            localStorage.setItem('backendPort', port);
            console.log(`Successfully connected to backend on port ${port}`);
            break;
          }
        } catch (err) {
          console.log(`Port ${port} not responding, trying next...`);
        }
      }
      
      if (data) {
        console.log("Fetched blood sugar data:", data);
        setBloodSugarData(data);
      } else {
        throw new Error('Could not connect to backend on any port');
      }
    } catch (error) {
      console.error('Error fetching blood sugar data:', error);
    }
  };

  const parseTimestamp = (timestamp) => {
    if (!timestamp) return null;
    
    try {
      let datePart, timePart;
      
      if (timestamp.includes(" ")) {
        [datePart, timePart] = timestamp.split(" ");
      } else if (timestamp.includes("T")) {
        [datePart, timePart] = timestamp.split("T");
      } else {
        datePart = timestamp;
        timePart = "00:00:00";
      }
      
      if (!datePart) return null;

      const dateComponents = datePart.split("-").map(Number);
      if (dateComponents.length !== 3) return null;
      
      const [year, month, day] = dateComponents;
      if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
      
      let hour = 0, minute = 0, second = 0;
      if (timePart) {
        const timeParts = timePart.split(":");
        hour = Number(timeParts[0] || 0);
        minute = Number(timeParts[1] || 0);
        second = Number(timeParts[2] || 0);
        
        if (isNaN(hour) || isNaN(minute) || isNaN(second)) {
          hour = 0;
          minute = 0;
          second = 0;
        }
      }
      

      return new Date(year, month - 1, day, hour, minute, second);
    } catch (error) {
      console.error("Error parsing timestamp:", timestamp, error);
      return null;
    }
  };

  const filterDataByTimeRange = () => {
    if (timeRange === "all") {
      setFilteredData(bloodSugarData);
      return;
    }
    
    let mostRecentDate = null;
    
    const validDates = bloodSugarData
      .map(reading => parseTimestamp(reading.timestamp))
      .filter(date => date !== null);
    
    if (validDates.length === 0) {
      console.error("No valid dates found in dataset");
      setFilteredData([]); 
      return;
    }
    
    mostRecentDate = new Date(Math.max(...validDates.map(date => date.getTime())));
    
    console.log("Most recent date in data:", mostRecentDate);
    
    let startDate;
    const endDate = new Date(mostRecentDate);
    
    if (timeRange === "1d") {
      startDate = new Date(mostRecentDate);
      startDate.setDate(startDate.getDate() - 1);
    } else if (timeRange === "1w") {
      startDate = new Date(mostRecentDate);
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeRange === "1m") {
      startDate = new Date(mostRecentDate);
      startDate.setDate(startDate.getDate() - 30);
    }
    
    console.log(`Filter range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    const filtered = bloodSugarData.filter(reading => {
      const readingDate = parseTimestamp(reading.timestamp);
      if (!readingDate) return false; 
      
      return readingDate >= startDate && readingDate <= endDate;
    });
    

    filtered.sort((a, b) => {
      const dateA = parseTimestamp(a.timestamp);
      const dateB = parseTimestamp(b.timestamp);
      if (!dateA || !dateB) return 0;
      return dateA - dateB;
    });
    
    console.log(`Filtered from ${bloodSugarData.length} to ${filtered.length} readings`);
    setFilteredData(filtered);
  };

  const analyzeData = async () => {
    try {
      setIsLoading(true);
      const backendPort = window.backendPort || 5001;
      console.log(`Using backend port ${backendPort} for analysis`);
      console.log("Sending data for analysis:", bloodSugarData);
      
      const response = await fetch(`http://localhost:${backendPort}/api/analyze-blood-sugar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: bloodSugarData }),
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.text();
      console.log("Analysis result:", result);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error:', error);
      setAnalysisResult('Failed to analyze blood sugar data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateChart = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    const formattedLabels = filteredData.map(row => {
      const date = parseTimestamp(row.timestamp);
      return date ? date.toLocaleString() : row.timestamp;
    });
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: formattedLabels,
        datasets: [{
          label: 'Blood Sugar Level (mg/dL)',
          data: filteredData.map(row => row.blood_sugar_level),
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Blood Sugar Level (mg/dL)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Blood Sugar Levels Over Time'
          }
        }
      }
    });
  };

  const handleNavigateToJournal = () => {
    navigate("/journal");
  };

  const handleFormSubmitSuccess = () => {
    fetchBloodSugarData();
  };

  const handleSaveToJournal = () => {
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    journalEntries.push(analysisResult);
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    alert('Analysis result saved to journal!');
  };

  const handleDeleteReading = async (reading) => {
    if (!window.confirm('Are you sure you want to delete this blood sugar reading?')) {
      return;
    }
    
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const port = localStorage.getItem('backendPort') || 5000;
      
      const response = await fetch(`http://localhost:${port}/api/blood-sugar-data`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          timestamp: reading.timestamp,
          bloodSugarLevel: reading.blood_sugar_level
        }),
      });
      
      if (response.ok) {
        fetchBloodSugarData();
      } else {
        const errorData = await response.json();
        console.error('Error deleting reading:', errorData);
        alert(`Error deleting reading: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting reading:', error);
      alert('Failed to delete reading. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Blood Sugar Analysis</h1>
      
      {/* Add the BloodSugarInputForm component */}
      <BloodSugarInputForm onSubmitSuccess={handleFormSubmitSuccess} />
      
      <div className="button-group">
        <button 
          className="analyze-button" 
          onClick={analyzeData}
          disabled={isLoading}
        >
          Analyze Blood Sugar Data
        </button>
        <button 
          className="analyze-button" 
          onClick={handleNavigateToJournal}
        >
          Go to Journal
        </button>
        <button className = "signoutbutton"
          onClick={() => {
            localStorage.removeItem('user');
            navigate("/login");
          }}
          >
          Sign Out
          </button>
      </div>
      

      {isLoading && <div className="loading">Analyzing data...</div>}
      
      <div className="time-range-selector">
        <button 
          className={`time-range-button ${timeRange === "all" ? "active" : ""}`}
          onClick={() => setTimeRange("all")}
        >
          All
        </button>
        <button 
          className={`time-range-button ${timeRange === "1d" ? "active" : ""}`}
          onClick={() => setTimeRange("1d")}
        >
          1 Day
        </button>
        <button 
          className={`time-range-button ${timeRange === "1w" ? "active" : ""}`}
          onClick={() => setTimeRange("1w")}
        >
          1 Week
        </button>
        <button 
          className={`time-range-button ${timeRange === "1m" ? "active" : ""}`}
          onClick={() => setTimeRange("1m")}
        >
          1 Month
        </button>
      </div>
      
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
      
      <h2>Blood Sugar Readings</h2>
      <table className="readings-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Blood Sugar Level (mg/dL)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((reading, index) => (
            <tr key={index}>
              <td>{reading.timestamp}</td>
              <td>{reading.blood_sugar_level}</td>
              <td>
                <button 
                  className="delete-button" 
                  onClick={() => handleDeleteReading(reading)}
                  title="Delete reading"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h2>Analysis Results</h2>
      <div className="analysis-result">
        {analysisResult}
      </div>
      <button 
        className="analyze-button" 
        onClick={handleSaveToJournal}>
        Save to Journal
      </button>
    </div>
    
  );
}

export default GraphPage;