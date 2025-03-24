import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BOARD_SIZE = 15;

const PlayOnline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, player } = location.state || {};  

  const [client, setClient] = useState(null);
  const [board, setBoard] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(""))
  );
  const [currentTurn, setCurrentTurn] = useState("X");
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!roomId || !player) {
      navigate("/lobby"); // Redirect to lobby if missing data
      return;
    }
  
    console.log("Connecting to WebSocket...");
  
    const socket = new SockJS("http://localhost:8080/ws/game");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: console.log,
      onConnect: () => {
        console.log("✅ Connected to WebSocket!");
  
        // Subscribe to game updates
        stompClient.subscribe(`/topic/game/${roomId}`, (message) => {
          console.log("📩 Received WebSocket message:", message.body);
  
          const updatedGame = JSON.parse(message.body);
          console.log("🔄 Updated Game State:", updatedGame);
  
          setBoard(updatedGame.board);
          setCurrentTurn(updatedGame.currentTurn);
          setWinner(updatedGame.winner);
        });
  
        // Request the initial game state from the server
        stompClient.publish({
          destination: "/app/game/state",
          body: JSON.stringify({ roomId }),
        });
        console.log("📨 Requested game state from server");
      },
    });
  
    stompClient.activate();
    setClient(stompClient);
  
    return () => stompClient.deactivate();
  }, [roomId, player, navigate]);

  const sendMove = (row, col) => {
    if (!client || player !== currentTurn || board[row][col] || winner) return;
  
    console.log(`Sending move: Player ${player} to (${row}, ${col})`);
    
    client.publish({
      destination: "/app/game/move",
      body: JSON.stringify({ roomId, row, col, player }),
    });
  };
  

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold my-4">Gomoku - Room</h1>
      <h2>Code "{roomId}" - Share code with your friends</h2>
      <p className="text-lg">You are playing as: <strong>{player}</strong></p>

      {/* GAME BOARD */}
      <div 
        className="grid gap-1 mt-4"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          border: "2px solid white",
        }}
      >
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <button
              key={`${rIdx}-${cIdx}`}
              onClick={() => sendMove(rIdx, cIdx)}
              className={`w-8 h-8 border flex items-center justify-center ${
                cell === "X" ? "bg-blue-500 text-white" : cell === "O" ? "bg-red-500 text-white" : "bg-gray-800"
              }`}
            >
              {cell || ""}
            </button>
          ))
        )}
      </div>

      {winner && <p className="text-2xl mt-4">Winner: {winner}</p>}

      <button onClick={() => navigate("/lobby")} className="mt-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg">
        Exit Game
      </button>
    </div>
  );
};

export default PlayOnline;
