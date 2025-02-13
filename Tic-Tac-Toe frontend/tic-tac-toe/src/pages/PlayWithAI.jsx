import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const [size, setSize] = useState(3);
  const [customSize, setCustomSize] = useState(3);
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

  function changeSize(newSize) {
    setSize(newSize);
    setBoard(Array(newSize * newSize).fill(null));
    setIsXNext(true);
  }

  function calculateWinner(board, size) {
    const lines = [];

    for (let i = 0; i < size; i++) {
      lines.push([...Array(size)].map((_, j) => i * size + j)); // Rows
      lines.push([...Array(size)].map((_, j) => i + j * size)); // Columns
    }

    lines.push([...Array(size)].map((_, i) => i * (size + 1))); // Main Diagonal
    lines.push([...Array(size)].map((_, i) => (i + 1) * (size - 1))); // Anti-Diagonal

    for (const line of lines) {
      if (line.every((index) => board[index] && board[index] === board[line[0]])) {
        return board[line[0]];
      }
    }
    return null;
  }

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Tic-Tac-Toe</h1>
      <div className="flex space-x-2 mb-4">
        {[3, 4, 5].map((gridSize) => (
          <button
            key={gridSize}
            onClick={() => changeSize(gridSize)}
            className={`px-4 py-2 rounded-lg font-bold ${size === gridSize ? "bg-blue-500" : "bg-gray-700"} hover:bg-blue-600`}
          >
            {gridSize}x{gridSize}
          </button>
        ))}
      </div>
      <div className="flex space-x-2 mb-4">
        <input
          type="number"
          min="3"
          max="10"
          value={customSize}
          onChange={(e) => setCustomSize(Number(e.target.value))}
          className="px-2 py-1 rounded-lg text-black"
        />
        <button
          onClick={() => changeSize(customSize)}
          className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        >
          Set Custom Grid
        </button>
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="w-16 h-16 text-2xl font-bold flex items-center justify-center bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700"
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
          onClick={() => navigate('/')}
          className="px-6 py-2 mt-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
        >
          Back
      </button>
    </div>
    
  );
}
