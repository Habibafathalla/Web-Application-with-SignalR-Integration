import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import "./style.css"; 

const App = () => {
  const [message, setMessage] = useState("Click the Start button to begin.");
  const [progress, setProgress] = useState<number | string | null>(null);
  const [storedDataList, setStoredDataList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Loading State Updated:", loading);
  }, [loading]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5021/progressHub")
      .withAutomaticReconnect([0, 2000, 5000, 10000]) 
      .build();
  
    const startConnection = async () => {
      try {
        await connection.start();
        console.log("Connected to SignalR");
      } catch (err) {
        console.error("SignalR Connection Error:", err);
        setTimeout(startConnection, 5000); 
      }
    };
  
    startConnection(); 
  
    connection.on("ProgressUpdate", (progress: number) => {
      setProgress(progress);
    });
  
    connection.on("ProcessCompleted", async () => {
      setProgress("Completed!");
      await fetchStoredData();
      setMessage("Click the Start button to begin.");
    });
  
    return () => {
      connection.stop();
    };
  }, []);
  

  const fetchStoredData = async () => {
    try {
      setError(null);

      const response = await fetch("http://localhost:5021/api/getData");
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const result: string[] | null = await response.json();
      if (!result || result.length === 0) {
        setMessage("Click on start button to begin");
        return;
      }

      setStoredDataList([...result]);

      console.log("Data fetched successfully.");
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError("⚠️ Failed to load data. Please try again.");
    }
  };

  useEffect(() => {
    fetchStoredData();
  }, []);

  const startProcess = async () => {
    console.log("Button is clicked");

    setLoading(true);
    setMessage("Process started...");
    setProgress(0);
    setError(null);

    try {
      const response = await fetch("http://localhost:5021/api/startProcess", { method: "POST" });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
    } catch (error) {
      console.error("Error starting process:", error);
      setError("⚠️ Failed to start process.");
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>Real-Time Process Tracker</h1>
        <p>{message}</p>

        
        <button className="button button-blue" onClick={startProcess} disabled={loading}>
          {loading ? <span className="spinner"></span> : "Start"}
        </button>

        
        {progress !== null && <p className="progress">Progress: {progress}</p>}

        
        {error && <p className="text-red">{error}</p>}

        
        <div className="data-box">
          <h2>Random Data</h2>
          <div className="scrollable-list">
            {storedDataList.length > 0 ? (
              storedDataList.map((item, index) => <p key={index} className="text-sm">{item}</p>)
            ) : (
              <p className="text-red">ℹ️ No data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
