import React, { useState } from 'react';
import UserTab from './UserTab';
import GameRoomTab from './GameRoomTab';

const Dashboard = ({ setIsLoggedIn }) => {
  const [activeTab, setActiveTab] = useState('users');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gomoku Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('gameRooms')}
          className={`px-4 py-2 rounded ${activeTab === 'gameRooms' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Game Rooms
        </button>
      </div>
      {activeTab === 'users' ? <UserTab /> : <GameRoomTab />}
    </div>
  );
};

export default Dashboard;