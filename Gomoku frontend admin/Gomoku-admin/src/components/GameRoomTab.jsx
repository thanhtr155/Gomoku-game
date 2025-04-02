import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GameRoomTab = () => {
  const [gameRooms, setGameRooms] = useState([]);

  useEffect(() => {
    fetchGameRooms();
  }, []);

  const fetchGameRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/games/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGameRooms(response.data);
    } catch (error) {
      console.error('Error fetching game rooms:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Game Rooms</h2>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border p-3 font-semibold">Room ID</th>
              <th className="border p-3 font-semibold">Player 1</th>
              <th className="border p-3 font-semibold">Player 2</th>
              <th className="border p-3 font-semibold">Current Turn</th>
              <th className="border p-3 font-semibold">Winner</th>
              <th className="border p-3 font-semibold">Finished</th>
            </tr>
          </thead>
          <tbody>
            {gameRooms.map((room) => (
              <tr key={room.roomId} className="border-b hover:bg-blue-50 transition-colors duration-200">
                <td className="border p-3 font-medium">{room.roomId}</td>
                <td className="border p-3">{room.player1}</td>
                <td className="border p-3">{room.player2 || 'Waiting'}</td>
                <td className="border p-3">{room.currentTurn}</td>
                <td className="border p-3">{room.winner || 'N/A'}</td>
                <td className="border p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      room.finished ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {room.finished ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameRoomTab;