import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to Tic-Tac-Toe Game</h1>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => navigate('/playonline')}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
        >
          Play Online
        </button>
        <button
          onClick={() => navigate('/playai')}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
        >
          Play With AI
        </button>
        <button
          onClick={() => navigate('/play')}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
        >
          Play
        </button>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;
