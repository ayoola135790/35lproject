import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../styles/graphPage.css";

function GraphPage() {
  const [bloodSugarData, setBloodSugarData] = useState([]);
  const [analysisResult, setAnalysisResult] = useState("Click the button above to analyze the blood sugar data.");
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetchBloodSugarData();
  }, []);

  // Update chart when data changes
  useEffect(() => {
    if (bloodSugarData.length > 0 && chartRef.current) {
      updateChart();
    }
  }, [bloodSugarData]);

  // Fetch blood sugar data from backend
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
        labels: bloodSugarData.map(row => row.timestamp),
        datasets: [{
          label: 'Blood Sugar Level (mg/dL)',
          data: bloodSugarData.map(row => row.blood_sugar_level),
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
          {bloodSugarData.map((reading, index) => (
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