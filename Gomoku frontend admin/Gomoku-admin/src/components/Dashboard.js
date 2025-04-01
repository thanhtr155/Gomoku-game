import React, { useState, useEffect } from "react";
import axios from "axios";
import UserTab from "./UserTab";
import GameHistoryTab from "./GameHistoryTab";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in Dashboard:", token);
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:8080/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Users:", userResponse.data);
        setUsers(userResponse.data);

        const historyResponse = await axios.get("http://localhost:8080/api/game-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Game History:", historyResponse.data);
        setGameHistory(historyResponse.data);
      } catch (err) {
        console.error("Fetch error:", err.response?.status, err.response?.data || err.message);
        setError("Failed to load data: " + (err.response?.status || "Unknown error") + " - " + (err.response?.data || err.message));
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("gameHistory")}
          className={`px-4 py-2 rounded ${activeTab === "gameHistory" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Game History
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {activeTab === "users" && <UserTab users={users} />}
        {activeTab === "gameHistory" && <GameHistoryTab gameHistory={gameHistory} />}
      </div>
    </div>
  );
};

export default Dashboard;