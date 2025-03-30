import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from "../services/authService";

const MainPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");
    console.log("MainPage: Checking localStorage:");
    console.log("userEmail:", email);
    console.log("token:", token);

    if (!email || !token) {
      console.log("No email or token found, redirecting to /login");
      navigate("/login");
    } else {
      setUserEmail(email);
      setIsLoggedIn(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutUser(); // Gọi hàm logoutUser từ authService
    setIsLoggedIn(false);
    setUserEmail(null);
    navigate("/login");
  };

  const handlePlayOnline = () => {
    if (!isLoggedIn) {
      alert("Please log in to play online!");
      navigate("/login");
      return;
    }
    navigate("/lobby");
  };

  const handlePlayOffline = () => {
    navigate("/playoffline");
  };

  const handlePlayWithAI = () => {
    navigate("/playai");
  };

  const handleRules = () => {
    navigate("/rules");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to Gomoku Game</h1>
      {isLoggedIn && userEmail && (
        <p className="mb-4">Logged in as: <strong>{userEmail}</strong></p>
      )}
      <div className="flex flex-col space-y-4">
        <button
          onClick={handlePlayOffline}
          className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        >
          Play Offline
        </button>
        <button
          onClick={handlePlayOnline}
          className="px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600"
        >
          Play Online
        </button>
        <button
          onClick={handlePlayWithAI}
          className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
        >
          Play With AI
        </button>
        <button
          onClick={handleRules}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
        >
          How to Play Gomoku Game
        </button>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default MainPage;