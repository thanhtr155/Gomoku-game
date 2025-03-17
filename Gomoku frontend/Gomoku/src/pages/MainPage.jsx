import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://i.pinimg.com/736x/56/20/fd/5620fda2ca837927e8d5525b528f6dd3.jpg")',
      }}
    >
      <h1 className="text-3xl font-bold mb-6">Welcome to Gomoku Game</h1>
      <div className="flex flex-col space-y-6">
        {/* Play Offline Button */}
        <button
          onClick={() => navigate('/playoffline')}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-md border-4 border-green-700 hover:bg-green-700 hover:border-green-800 transform transition duration-200 ease-in-out hover:scale-105"
        >
          Play Offline
        </button>

        {/* Play Online Button */}
        <button
          onClick={() => navigate('/playonline')}
          className="px-8 py-3 bg-yellow-600 text-white font-bold rounded-xl shadow-md border-4 border-yellow-700 hover:bg-yellow-700 hover:border-yellow-800 transform transition duration-200 ease-in-out hover:scale-105"
        >
          Play Online
        </button>

        {/* Play With AI Button */}
        <button
          onClick={() => navigate('/playai')}
          className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl shadow-md border-4 border-red-700 hover:bg-red-700 hover:border-red-800 transform transition duration-200 ease-in-out hover:scale-105"
        >
          Play With AI
        </button>

        {/* How to play Gomoku Game Button */}
        <button
          onClick={() => navigate('/rules')}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md border-4 border-blue-700 hover:bg-blue-700 hover:border-blue-800 transform transition duration-200 ease-in-out hover:scale-105"
        >
          How to play Gomoku Game
        </button>
      </div>
    </div>
  );
};

export default MainPage;
