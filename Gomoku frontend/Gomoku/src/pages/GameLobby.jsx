import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameLobby = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [playerEmail, setPlayerEmail] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");
    console.log("GameLobby: Checking localStorage:");
    console.log("userEmail:", email);
    console.log("token:", token);

    if (!email || !token) {
      console.log("No email or token found, redirecting to /login");
      navigate("/login");
    } else {
      setPlayerEmail(email);
      fetchAvailableRooms(token);
    }
  }, [navigate]);

  const fetchAvailableRooms = async (token) => {
    try {
      console.log("Fetching available rooms with token:", token);
      const response = await fetch("http://localhost:8080/api/games/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        throw new Error(errorData.message || "Failed to fetch available rooms");
      }

      const data = await response.json();
      console.log("Available rooms:", data);
      setAvailableRooms(data);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      setMessage(error.message);
    }
  };

  const createRoom = async () => {
    if (!playerEmail) {
      setMessage("Please log in to create a room.");
      return;
    }

    const newRoomId = "room-" + Math.floor(Math.random() * 10000);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch("http://localhost:8080/api/games/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId: newRoomId, player1: playerEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create room");
      }

      const data = await response.json();
      navigate(`/playonline`, { state: { roomId: data.roomId, player: playerEmail } });
    } catch (error) {
      console.error("Error creating room:", error);
      setMessage(error.message);
    }
  };

  const joinRoom = async (id = roomId) => {
    if (!playerEmail) {
      setMessage("Please log in to join a room.");
      return;
    }
    if (!id) {
      setMessage("Please enter a valid room ID.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch("http://localhost:8080/api/games/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId: id, player2: playerEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join room");
      }

      navigate(`/playonline`, { state: { roomId: id, player: playerEmail } });
    } catch (error) {
      console.error("Error joining room:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold my-4">Game Lobby</h1>

      <button onClick={createRoom} className="px-4 py-2 bg-green-500 m-2 rounded">
        Create Room
      </button>

      <div className="w-1/2">
        <h3 className="text-xl font-bold">Available Rooms</h3>
        {availableRooms.length > 0 ? (
          <ul className="mt-2">
            {availableRooms.map((room) => (
              <li key={room.roomId} className="flex justify-between items-center p-2 bg-gray-800 rounded mb-2">
                <span>Room: {room.roomId} (Player 1: {room.player1})</span>
                <button
                  onClick={() => joinRoom(room.roomId)}
                  className="px-4 py-1 bg-blue-500 rounded"
                >
                  Join
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 mt-2">No available rooms.</p>
        )}
      </div>

      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="px-2 py-1 text-black rounded mt-4"
      />
      <button onClick={() => joinRoom()} className="px-4 py-2 bg-blue-500 m-2 rounded">
        Join Room
      </button>

      {message && <p className="text-red-500 mt-4">{message}</p>}

      <button
        onClick={() => navigate("/main")}
        className="mt-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg"
      >
        Go Back
      </button>
    </div>
  );
};

export default GameLobby;