import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

const PlayWithAI = () => {
  const navigate = useNavigate();
  const size = 15; // Kích thước bàn cờ Gomoku
  const [board, setBoard] = useState(Array(size).fill().map(() => Array(size).fill(""))); 
  const [client, setClient] = useState(null);
  const [gameStatus, setGameStatus] = useState("Đang khởi tạo...");
  const [isAITurn, setIsAITurn] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const startGame = async () => {
      try {
        const response = await axios.post("http://localhost:8080/api/games/join-ai", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        console.log("Game started:", response.data);
      } catch (error) {
        console.error("Lỗi khi bắt đầu game:", error.response?.data || error.message);
      }
    };

    const setupWebSocket = () => {
      const sock = new SockJS("http://localhost:8080/ws/game");
      const stompClient = new Client({
        webSocketFactory: () => sock,
        connectHeaders: { Authorization: `Bearer ${token}` },
        debug: (str) => console.log(str),
        onConnect: () => {
          console.log("Đã kết nối WebSocket");
          stompClient.subscribe(`/topic/game`, (msg) => {
            const gameRoom = JSON.parse(msg.body);
            setBoard(gameRoom.board);
            if (gameRoom.currentTurn === "O") {
              setIsAITurn(true);
              setGameStatus("AI đang suy nghĩ...");
            } else {
              setIsAITurn(false);
            }
            if (gameRoom.isFinished) {
              setGameStatus(gameRoom.winner ? `${gameRoom.winner} thắng!` : "Hòa!");
              setIsAITurn(false);
            }
          });
        },
        onStompError: (err) => console.error("STOMP Error:", err),
      });

      stompClient.activate();
      setClient(stompClient);
    };

    startGame();
    setupWebSocket();
  }, [token, navigate]);

  const handleClick = (index) => {
    if (isAITurn || gameStatus.includes("AI đang suy nghĩ")) return;
    const row = Math.floor(index / size);
    const col = index % size;
    if (client && board[row][col] === "") {
      client.publish({
        destination: "/app/game/move",
        body: JSON.stringify({ row, col, player: "X" }),
      });
      setIsAITurn(true);
      setGameStatus("AI đang suy nghĩ...");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
      <h1 className="text-4xl font-extrabold mb-6">Gomoku: Bạn (X) vs AI (O)</h1>
      <p className="text-xl font-semibold mb-6">{gameStatus}</p>
      <div className="grid gap-1 p-3 bg-gray-800 rounded-lg" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {board.flat().map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={cell || gameStatus.includes("Trò chơi kết thúc") || isAITurn}
            className={`w-10 h-10 flex items-center justify-center border border-gray-600 rounded-lg text-xl font-bold
              ${cell === "X" ? "text-red-500" : cell === "O" ? "text-blue-500" : "text-gray-400"}`}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayWithAI;