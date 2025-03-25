import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GameLobby = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");

  const createRoom = async () => {
    const newRoomId = "room-" + Math.floor(Math.random() * 10000);
    
    try {
      const response = await fetch("http://localhost:8080/api/games/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: newRoomId, player1: "X" }),
      });

      if (!response.ok) throw new Error("Failed to create room");

      const data = await response.json();
      navigate(`/playonline`, { state: { roomId: data.roomId, player: "X" } });  // Redirect to PlayOnline
    } catch (error) {
      console.error("Error creating room:", error);
      setMessage("Failed to create room");
    }
  };

  const joinRoom = () => {
    if (!roomId) {
      setMessage("Please enter a valid room ID.");
      return;
    }
    navigate(`/playonline`, { state: { roomId, player: "O" } }); // Redirect to PlayOnline as Player O
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold my-4">Game Lobby</h1>

      <button onClick={createRoom} className="px-4 py-2 bg-green-500 m-2 rounded">
        Create Room
      </button>
      
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="px-2 py-1 text-black rounded"
      />
      <button onClick={joinRoom} className="px-4 py-2 bg-blue-500 m-2 rounded">
        Join Room
      </button>

      {message && <p className="text-red-500 mt-4">{message}</p>}

      <button onClick={() => navigate('/main')} className="mt-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg">
        Go Back
      </button>
    </div>
  );
};

export default GameLobby;
