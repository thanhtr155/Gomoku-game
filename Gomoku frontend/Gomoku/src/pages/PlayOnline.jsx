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
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board, BOARD_SIZE);

  useEffect(() => {
    if (!roomId || !player) {
      navigate("/lobby");
      return;
    }

    console.log("Connecting to WebSocket...");

    const socket = new SockJS("http://localhost:8080/ws/game");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: console.log,
      onConnect: () => {
        console.log("✅ Connected to WebSocket!");

        stompClient.subscribe(`/topic/game/${roomId}`, (message) => {
          console.log("📩 Received WebSocket message:", message.body);
        
          try {
            const updatedGame = JSON.parse(message.body);
            console.log("🔄 Updated Game State:", updatedGame);
        
            if (!updatedGame.board) {
              console.error("🚨 Missing board data in received message:", updatedGame);
              return;
            }
        
            console.log("⬇️ Setting new board state:", updatedGame.board);
            setBoard([...updatedGame.board]); // Ensure re-render
            setIsXNext(updatedGame.currentTurn === "X");
          } catch (error) {
            console.error("🚨 Error parsing WebSocket message:", error);
          }
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

  const sendMove = (index) => {
    if (!client || board[index] || winner) {
      console.warn("Invalid move or game ended.");
      return;
    }

    if ((isXNext && player !== "X") || (!isXNext && player !== "O")) {
      console.warn("Not your turn!");
      return;
    }

    console.log(`Sending move: Player ${player} to index ${index}`);

    client.publish({
      destination: "/app/game/move",
      body: JSON.stringify({ roomId, index, player }),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Gomoku - Room</h1>
      <h2>Code "{roomId}" - Share code with your friends</h2>
      <p className="text-lg">You are playing as: <strong>{player}</strong></p>

      {/* GAME BOARD */}
      <div
        className="grid gap-1 p-2 bg-gray-900 bg-opacity-70 rounded-lg"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => sendMove(index)}
            className="w-10 h-10 text-lg font-bold flex items-center justify-center bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700"
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && <p className="mt-4 text-xl font-semibold">{winner} Wins!</p>}

      <button
        onClick={() => navigate("/lobby")}
        className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
      >
        Exit Game
      </button>
    </div>
  );
};

function calculateWinner(board, size) {
  const directions = [
    [1, 0], // Horizontal
    [0, 1], // Vertical
    [1, 1], // Diagonal (\)
    [1, -1], // Diagonal (/)
  ];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const start = row * size + col;
      if (!board[start]) continue;

      for (const [dx, dy] of directions) {
        let count = 1;
        for (let step = 1; step < 5; step++) {
          const x = row + dx * step;
          const y = col + dy * step;
          if (x < 0 || x >= size || y < 0 || y >= size) break;
          if (board[x * size + y] === board[start]) {
            count++;
          } else {
            break;
          }
        }
        if (count === 5) return board[start];
      }
    }
  }
  return null;
}

export default PlayOnline;
