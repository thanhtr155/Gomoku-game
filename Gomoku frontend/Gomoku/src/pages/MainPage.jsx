import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to Tic-Tac-Toe Game</h1>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => navigate('/playoffline')}
          className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        >
          Play Offline
        </button>
        <button
          onClick={() => navigate('/playonline')}
          className="px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600"
        >
          Play Online
        </button>
        <button
          onClick={() => navigate('/playai')}
          className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-yellow-600"
        >
          Play With AI
        </button>
        <button
          onClick={() => navigate('/rules')}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-yellow-600"
        >
          How to play Gomoku Game
        </button>
      </div>
    </div>
  );
};

export default MainPage