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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col h-screen p-6">
        <h1 className="text-4xl font-extrabold mb-8">Gomoku Admin</h1>
        <div className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left py-3 px-4 rounded-lg ${
              activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-700'
            } transition-all duration-300`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('gameRooms')}
            className={`w-full text-left py-3 px-4 rounded-lg ${
              activeTab === 'gameRooms' ? 'bg-blue-600' : 'hover:bg-gray-700'
            } transition-all duration-300`}
          >
            Game Rooms
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-300"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 p-6"
        style={{
          backgroundImage: `url('https://anhdephd.vn/wp-content/uploads/2022/05/background-phong-canh-chill.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 min-h-[calc(100vh-3rem)]">
          {activeTab === 'users' ? <UserTab /> : <GameRoomTab />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;