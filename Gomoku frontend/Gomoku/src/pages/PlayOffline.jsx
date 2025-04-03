import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlayOffline() {
  const navigate = useNavigate();
  const size = 15;
  const [board, setBoard] = useState(Array(size * size).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winningCells, setWinningCells] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const winner = calculateWinner(board, size);
  const isDraw = !winner && board.every((cell) => cell !== null);

  function handleClick(index) {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const newWinner = calculateWinner(newBoard, size);
    if (newWinner) {
      const winningCells = calculateWinningCells(newBoard, size);
      setWinningCells(winningCells);
      setShowWinnerModal(true);
    } else if (newBoard.every((cell) => cell !== null)) {
      setShowWinnerModal(true);
    }
  }

  function resetGame() {
    setBoard(Array(size * size).fill(null));
    setIsXNext(true);
    setWinningCells([]);
    setShowWinnerModal(false);
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

  function calculateWinningCells(board, size) {
    const directions = [
      [1, 0], // Ngang
      [0, 1], // Dọc
      [1, 1], // Chéo chính (\)
      [1, -1], // Chéo phụ (/)
    ];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const start = row * size + col;
        if (!board[start]) continue;

        for (const [dx, dy] of directions) {
          let positions = [];
          let count = 0;
          let currentRow = row;
          let currentCol = col;

          // Kiểm tra các ô liên tiếp theo hướng hiện tại
          while (
            currentRow >= 0 &&
            currentRow < size &&
            currentCol >= 0 &&
            currentCol < size &&
            board[currentRow * size + currentCol] === board[start]
          ) {
            positions.push({ row: currentRow, col: currentCol });
            count++;
            currentRow += dx;
            currentCol += dy;
          }

          // Kiểm tra hướng ngược lại
          currentRow = row - dx;
          currentCol = col - dy;
          while (
            currentRow >= 0 &&
            currentRow < size &&
            currentCol >= 0 &&
            currentCol < size &&
            board[currentRow * size + currentCol] === board[start]
          ) {
            positions.push({ row: currentRow, col: currentCol });
            count++;
            currentRow -= dx;
            currentCol -= dy;
          }

          if (count >= 5) {
            // Sắp xếp các vị trí theo thứ tự tăng dần
            positions.sort((a, b) => {
              if (dx !== 0 && dy !== 0) {
                return a.row - b.row; // Chéo: sắp xếp theo row
              } else if (dx !== 0) {
                return a.row - b.row; // Dọc: sắp xếp theo row
              } else {
                return a.col - b.col; // Ngang: sắp xếp theo col
              }
            });
            // Chỉ lấy 5 vị trí đầu tiên
            return positions.slice(0, 5);
          }
        }
      }
    }
    return [];
  }

  const isWinningCell = (row, col) => {
    return winningCells.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white p-6"
      style={{
        backgroundImage: `url('https://png.pngtree.com/thumb_back/fw800/background/20241012/pngtree-a-painting-of-japanese-landscape-with-cherry-blossom-trees-and-temple-image_16367157.jpg')`,
      }}
    >
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-600 animate-title-shimmer">
          Gomoku Offline
        </h1>
        <div className="relative">
          <div
            className="grid gap-1 p-6 bg-gray-800/80 rounded-xl shadow-2xl animate-board-rise"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {board.map((cell, index) => {
              const row = Math.floor(index / size);
              const col = index % size;
              return (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className={`w-12 h-12 text-2xl font-bold flex items-center justify-center rounded-md shadow-lg transition-all duration-300 transform hover:scale-110 ${
                    cell === "X"
                      ? "bg-blue-600 text-white animate-cell-pop"
                      : cell === "O"
                      ? "bg-red-600 text-white animate-cell-pop"
                      : "bg-gray-700 hover:bg-gray-600 animate-cell-slide"
                  } ${isWinningCell(row, col) ? "winning-cell" : ""}`}
                >
                  {cell}
                </button>
              );
            })}
          </div>
        </div>

        {showWinnerModal && (winner || isDraw) && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
              <h3 className="text-3xl font-bold text-green-400 mb-4 text-center">
                Game Over!
              </h3>
              {winner ? (
                <>
                  <p className="text-xl text-white mb-4 text-center">
                    Winner: <strong>{winner}</strong>
                  </p>
                  <p className="text-xl text-white mb-6 text-center">
                    Loser: <strong>{winner === "X" ? "O" : "X"}</strong>
                  </p>
                </>
              ) : (
                <p className="text-xl text-yellow-400 mb-6 text-center">
                  It’s a Draw!
                </p>
              )}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowWinnerModal(false)}
                  className="relative px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-110 transition-all duration-500 group overflow-hidden"
                >
                  <span className="relative z-10">Close</span>
                  <span className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></span>
                </button>
              </div>
            </div>
          </div>
        )}

        {(winner || isDraw) && !showWinnerModal && (
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={resetGame}
              className="relative px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg shadow-xl hover:from-red-600 hover:to-pink-700 transform hover:scale-110 hover:rotate-2 transition-all duration-500 group overflow-hidden animate-button-pop"
            >
              <span className="relative z-10">Reset Game</span>
              <span className="absolute inset-0 bg-red-400 opacity-0 group-hover:opacity-40 animate-pulse-ring transition-opacity duration-500"></span>
            </button>
            <button
              onClick={() => navigate("/main")}
              className="relative px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-110 hover:rotate-2 transition-all duration-500 group overflow-hidden animate-button-pop"
            >
              <span className="relative z-10">Back</span>
              <span className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-40 animate-pulse-ring transition-opacity duration-500"></span>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes title-shimmer {
          0% { text-shadow: 0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.3); }
          50% { text-shadow: 0 0 15px rgba(0, 255, 255, 1), 0 0 25px rgba(0, 255, 255, 0.8); }
          100% { text-shadow: 0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.3); }
        }
        @keyframes board-rise {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cell-pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cell-slide {
          0% { opacity: 0; transform: translateX(-20px); }
          50% { opacity: 0.5; transform: translateX(10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes result-fade {
          0% { opacity: 0; filter: blur(3px); transform: translateY(10px); }
          100% { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        @keyframes button-pop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.3); }
          50% { box-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 25px rgba(255, 255, 255, 0.8); }
          100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.3); }
        }
        .winning-cell {
          border: 3px solid white !important;
          animation: glow 1.5s ease-in-out infinite;
        }
        .animate-title-shimmer {
          animation: title-shimmer 3s ease-in-out infinite;
        }
        .animate-board-rise {
          animation: board-rise 0.8s ease-out;
        }
        .animate-cell-pop {
          animation: cell-pop 0.5s ease-out;
        }
        .animate-cell-slide {
          animation: cell-slide 0.5s ease-out;
        }
        .animate-result-fade {
          animation: result-fade 0.7s ease-out;
        }
        .animate-button-pop {
          animation: button-pop 0.6s ease-out;
        }
        .animate-pulse-ring {
          animation: pulse-ring 1s ease-out infinite;
        }
      `}</style>
    </div>
  );
}