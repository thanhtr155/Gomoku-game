import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const size = 10;
  const [board, setBoard] = useState(Array(size * size).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board, size);
  const isDraw = !winner && board.every((cell) => cell !== null);

  function handleClick(index) {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }

  function resetGame() {
    setBoard(Array(size * size).fill(null));
    setIsXNext(true);
  }

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">10x10 Tic-Tac-Toe (Win 5 in a Row)</h1>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
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
      {winner && <p className="mt-4 text-xl font-semibold">{winner} Wins!</p>}
      {isDraw && <p className="mt-4 text-xl font-semibold">It’s a Draw!</p>}
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
      >
        Reset Game
      </button>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 mt-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
      >
        Back
      </button>
    </div>
  );
}
