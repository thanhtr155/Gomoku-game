import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
 const navigate = useNavigate();
 const size = 15;
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

 if (!calculateWinner(newBoard, size) && newBoard.every((cell) => cell !== null)) {
 alert("It's a Draw!");
 }
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white p-6" style={{ backgroundImage: `url('https://img6.thuthuatphanmem.vn/uploads/2022/03/16/background-den-led-chuyen-sac_085304512.jpg')` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-blue-900/50 animate-gradient-shift"></div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-600 animate-text-glow">
          Gomoku Offline
        </h1>
        <div
          className="grid gap-1 p-6 bg-gray-800/80 rounded-xl shadow-2xl animate-fade-slide-up"
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`w-12 h-12 text-2xl font-bold flex items-center justify-center rounded-md shadow-lg transition-all duration-300 transform hover:scale-110 ${
                cell === "X"
                  ? "bg-blue-600 text-white animate-pulse"
                  : cell === "O"
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-gray-700 hover:bg-gray-600 animate-bounce-in"
              }`}
            >
              {cell}
            </button>
          ))}
        </div>
        {winner && (
          <p className="mt-6 text-3xl font-semibold text-green-400 animate-text-reveal text-center">
            {winner} Wins!
          </p>
        )}
        {isDraw && (
          <p className="mt-6 text-3xl font-semibold text-yellow-400 animate-text-reveal text-center">
            It’s a Draw!
          </p>
        )}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={resetGame}
            className="relative px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg shadow-xl hover:from-red-600 hover:to-pink-700 transform hover:scale-110 hover:rotate-2 transition-all duration-500 group overflow-hidden"
          >
            <span className="relative z-10">Reset Game</span>
            <span className="absolute inset-0 bg-red-400 opacity-0 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></span>
          </button>
          <button
            onClick={() => navigate("/main")}
            className="relative px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-110 hover:rotate-2 transition-all duration-500 group overflow-hidden"
          >
            <span className="relative z-10">Back</span>
            <span className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift { ... }
        @keyframes text-glow { ... }
        @keyframes bounce-in { ... }
        @keyframes fade-slide-up { ... }
        @keyframes text-reveal { ... }
      `}</style>
    </div>
  );
}
