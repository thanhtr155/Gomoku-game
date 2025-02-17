import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const size = 5;
  const [board, setBoard] = useState(Array(size * size).fill(null));
  const winner = calculateWinner(board, size);
  const isDraw = !winner && board.every((cell) => cell);

  function handleClick(index) {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = "O";
    setBoard(newBoard);
    if (!calculateWinner(newBoard, size)) setTimeout(() => playAIMove(newBoard), 300);
  }

  function playAIMove(currentBoard) {
    const bestMove = getBestMove(currentBoard);
    if (bestMove !== -1) {
      currentBoard[bestMove] = "X";
      setBoard([...currentBoard]);
    }
  }

  function getBestMove(currentBoard) {
    let bestValue = -Infinity, bestMove = -1;
    currentBoard.forEach((cell, i) => {
      if (!cell) {
        currentBoard[i] = "X";
        let moveValue = minimax(currentBoard, 0, false, -Infinity, Infinity);
        currentBoard[i] = null;
        if (moveValue > bestValue) [bestValue, bestMove] = [moveValue, i];
      }
    });
    return bestMove;
  }

  function minimax(board, depth, isMax, alpha, beta) {
    const win = calculateWinner(board, size);
    if (win) return win === "X" ? 10 - depth : depth - 10;
    if (board.every((cell) => cell)) return 0;

    let best = isMax ? -Infinity : Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = isMax ? "X" : "O";
        let value = minimax(board, depth + 1, !isMax, alpha, beta);
        board[i] = null;
        best = isMax ? Math.max(best, value) : Math.min(best, value);
        if (isMax) alpha = Math.max(alpha, best);
        else beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }

  function calculateWinner(board, size) {
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        for (const [dx, dy] of directions) {
          let count = 1, start = r * size + c;
          if (!board[start]) continue;
          for (let step = 1; step < 5; step++) {
            let x = r + dx * step, y = c + dy * step;
            if (x >= size || y >= size || y < 0 || board[x * size + y] !== board[start]) break;
            count++;
          }
          if (count === 5) return board[start];
        }
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">You (O) vs Bot (X)</h1>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)} disabled={cell || winner}
            className="w-10 h-10 flex items-center justify-center bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700">
            {cell}
          </button>
        ))}
      </div>
      {winner && <p className="mt-4 text-xl font-semibold">{winner} You Win!</p>}
      {isDraw && <p className="mt-4 text-xl font-semibold">It's Draw!</p>}
      <button onClick={() => setBoard(Array(size * size).fill(null))}
        className="mt-4 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600">Reset</button>
      <button onClick={() => navigate("/")}
        className="px-6 py-2 mt-4 bg-blue-500 rounded-lg hover:bg-blue-600">Back</button>
    </div>
  );
}
