import React, { useState, useEffect } from "react";
import { connectWebSocket, sendMove, disconnectWebSocket } from "../services/websocketService";
import { useNavigate } from "react-router-dom";

const BOARD_SIZE = 10;

const GomokuBoard = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [mySymbol, setMySymbol] = useState(null);
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    const gameIdFromURL = new URLSearchParams(window.location.search).get("gameId");
    setGameId(gameIdFromURL || "default-game"); // Assign default game if no ID
    setMySymbol(gameIdFromURL ? "O" : "X"); // First player is X, second is O

    connectWebSocket(handleMoveReceived);
    return () => disconnectWebSocket();
  }, []);

  const handleMoveReceived = (move) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[move.row * BOARD_SIZE + move.col] = move.player;
      return newBoard;
    });

    setCurrentPlayer(move.player === "X" ? "O" : "X");
  };

  const handleClick = (index) => {
    if (board[index] || currentPlayer !== mySymbol) return;
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    sendMove(gameId, mySymbol, row, col);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Gomoku Multiplayer</h1>
      <p className="text-lg mb-2">You are: {mySymbol}</p>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="w-10 h-10 text-lg font-bold flex items-center justify-center bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700"
          >
            {cell}
          </button>
        ))}
      </div>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 mt-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
      >
        Back
      </button>
    </div>
  );
};
export default GomokuBoard;
