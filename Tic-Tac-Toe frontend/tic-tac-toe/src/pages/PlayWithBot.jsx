import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const size = 10;
  const [board, setBoard] = useState(Array(size * size).fill(null));
  const winner = calculateWinner(board, size);
  const isDraw = !winner && board.every((cell) => cell !== null);

  // Người chơi luôn là O, máy luôn là X
  function handleClick(index) {
    if (board[index] || winner) return;

    // Người chơi đi (O)
    const newBoard = [...board];
    newBoard[index] = "O";
    setBoard(newBoard);

    // Sau khi người chơi đi, nếu chưa có người thắng thì máy sẽ đi
    if (!calculateWinner(newBoard, size)) {
      setTimeout(() => playAIMove(newBoard), 500); // Máy đi sau 0.5 giây
    }
  }

  // Hàm AI: Máy (X) chọn nước đi tốt nhất bằng Minimax
  function playAIMove(currentBoard) {
    const bestMove = getBestMove(currentBoard);
    if (bestMove !== -1) {
      currentBoard[bestMove] = "X";
      setBoard([...currentBoard]);
    }
  }

  // Tìm nước đi tốt nhất cho máy bằng Minimax
  function getBestMove(currentBoard) {
    let bestValue = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = "X";
        let moveValue = minimax(currentBoard, 0, false);
        currentBoard[i] = null;

        if (moveValue > bestValue) {
          bestValue = moveValue;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  // Hàm Minimax có Alpha-Beta Pruning
  function minimax(newBoard, depth, isMaximizing) {
    const winner = calculateWinner(newBoard, size);
    if (winner === "X") return 10 - depth;
    if (winner === "O") return depth - 10;
    if (newBoard.every((cell) => cell !== null)) return 0;

    if (isMaximizing) {
      let bestValue = -Infinity;
      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = "X";
          bestValue = Math.max(bestValue, minimax(newBoard, depth + 1, false));
          newBoard[i] = null;
        }
      }
      return bestValue;
    } else {
      let bestValue = Infinity;
      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = "O";
          bestValue = Math.min(bestValue, minimax(newBoard, depth + 1, true));
          newBoard[i] = null;
        }
      }
      return bestValue;
    }
  }

  // Hàm kiểm tra người thắng
  function calculateWinner(board, size) {
    const directions = [
      [1, 0],   // Ngang
      [0, 1],   // Dọc
      [1, 1],   // Chéo \
      [1, -1],  // Chéo /
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
      <h1 className="text-3xl font-bold mb-4">Cờ Caro: Bạn (O) vs Máy (X)</h1>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={cell !== null || winner}
            className="w-10 h-10 text-lg font-bold flex items-center justify-center bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700"
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && <p className="mt-4 text-xl font-semibold">{winner} Thắng!</p>}
      {isDraw && <p className="mt-4 text-xl font-semibold">Hòa!</p>}
      <button
        onClick={() => setBoard(Array(size * size).fill(null))}
        className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
      >
        Chơi lại
      </button>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 mt-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
      >
        Quay lại
      </button>
    </div>
  );
}


