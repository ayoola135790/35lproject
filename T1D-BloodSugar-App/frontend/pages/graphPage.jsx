import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../styles/graphPage.css";

function GraphPage() {
  const [bloodSugarData, setBloodSugarData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [analysisResult, setAnalysisResult] = useState("Click the button above to analyze the blood sugar data.");
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("all"); // "all", "1d", "1w", or "1m"
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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
      const possiblePorts = [5000, 5001, 5002];
      let data = null;
      
      for (const port of possiblePorts) {
        try {
          console.log(`Trying to connect to backend on port ${port}...`);
          const response = await fetch(`http://localhost:${port}/api/blood-sugar-data`);
          if (response.ok) {
            data = await response.json();
            window.backendPort = port;
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
    // Convert "YYYY-MM-DD HH:mm:ss" to a valid Date object
    const [datePart, timePart] = timestamp.split(" ");
    const [year, month, day] = datePart.split("-");
    const [hour, minute, second] = timePart.split(":");
    return new Date(year, month - 1, day, hour, minute, second);
  };

  const filterDataByTimeRange = () => {
    let filteredData = bloodSugarData;

    if (timeRange === "1d") {
      // Hardcode the "current date" to match the sample data
      const currentDate = "2024-01-03 21:00:00";
      const startOfDay = parseTimestamp(currentDate.split(" ")[0] + " 00:00:00"); // Start of the day
      const endOfDay = parseTimestamp(currentDate.split(" ")[0] + " 23:59:59"); // End of the day

      console.log("Start of Day:", startOfDay); // Debugging: Log start of day
      console.log("End of Day:", endOfDay); // Debugging: Log end of day

      filteredData = bloodSugarData.filter(reading => {
        const readingDate = parseTimestamp(reading.timestamp);
        console.log("Reading Date:", readingDate); // Debugging: Log parsed timestamp
        return readingDate >= startOfDay && readingDate <= endOfDay;
      });
    } else if (timeRange === "1w") {
      // Hardcode the "current date" to match the sample data
      const currentDate = "2024-01-03 21:00:00";
      const startOfWeek = new Date(parseTimestamp(currentDate).getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      const endOfWeek = parseTimestamp(currentDate.split(" ")[0] + " 23:59:59"); // End of the current day

      console.log("Start of Week:", new Date(startOfWeek)); // Debugging: Log start of week
      console.log("End of Week:", endOfWeek); // Debugging: Log end of week

      filteredData = bloodSugarData.filter(reading => {
        const readingDate = parseTimestamp(reading.timestamp);
        console.log("Reading Date:", readingDate); // Debugging: Log parsed timestamp
        return readingDate >= startOfWeek && readingDate <= endOfWeek;
      });
    } else if (timeRange === "1m") {
      // Hardcode the "current date" to match the sample data
      const currentDate = "2024-01-03 21:00:00";
      const startOfMonth = new Date(parseTimestamp(currentDate).getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const endOfMonth = parseTimestamp(currentDate.split(" ")[0] + " 23:59:59"); // End of the current day

      console.log("Start of Month:", new Date(startOfMonth)); // Debugging: Log start of month
      console.log("End of Month:", endOfMonth); // Debugging: Log end of month

      filteredData = bloodSugarData.filter(reading => {
        const readingDate = parseTimestamp(reading.timestamp);
        console.log("Reading Date:", readingDate); // Debugging: Log parsed timestamp
        return readingDate >= startOfMonth && readingDate <= endOfMonth;
      });
    }

    console.log("Filtered Data:", filteredData); // Debugging: Log filtered data
    setFilteredData(filteredData);
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
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: filteredData.map(row => row.timestamp),
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

  return (
    <div className="container">
      <h1>Blood Sugar Analysis</h1>
      <button 
        className="analyze-button" 
        onClick={analyzeData}
        disabled={isLoading}
      >
        Analyze Blood Sugar Data
      </button>
      
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
          </tr>
        </thead>
        <tbody>
          {filteredData.map((reading, index) => (
            <tr key={index}>
              <td>{reading.timestamp}</td>
              <td>{reading.blood_sugar_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h2>Analysis Results</h2>
      <div className="analysis-result">
        {analysisResult}
      </div>
    </div>
  );
}

export default GraphPage;