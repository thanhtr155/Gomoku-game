import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Gomoku() {
 const navigate = useNavigate();
 const size = 10;
 const [board, setBoard] = useState(Array(size * size).fill(null));
 const [isPlayerTurn, setIsPlayerTurn] = useState(true);
 const winner = calculateWinner(board, size);
 const isDraw = !winner && board.every((cell) => cell);

 function handleClick(index) {
 if (board[index] || winner || !isPlayerTurn) return;
 const newBoard = [...board];
 newBoard[index] = "O";
 setBoard(newBoard);
 setIsPlayerTurn(false);
 if (!calculateWinner(newBoard, size)) {
 setTimeout(() => playAIMove(newBoard), 300);
 }
 }

 function playAIMove(currentBoard) {
 const bestMove = getBestMove(currentBoard);
 if (bestMove !== -1) {
 const newBoard = [...currentBoard];
 newBoard[bestMove] = "X";
 setBoard(newBoard);
 setIsPlayerTurn(true);
 }
 }

 function getBestMove(currentBoard) {
 let bestValue = -Infinity;
 let bestMove = -1;
 currentBoard.forEach((cell, i) => {
 if (!cell) {
 currentBoard[i] = "X";
 let moveValue = minimax(currentBoard, 0, false, -Infinity, Infinity);
 currentBoard[i] = null;
 if (moveValue > bestValue) {
 bestValue = moveValue;
 bestMove = i;
 }
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
 const directions = [
 [1, 0], // Horizontal
 [0, 1], // Vertical
 [1, 1], // Diagonal down-right
 [1, -1], // Diagonal down-left
 ];
 for (let r = 0; r < size; r++) {
 for (let c = 0; c < size; c++) {
 for (const [dx, dy] of directions) {
 let count = 1;
 const start = r * size + c;
 if (!board[start]) continue;
 for (let step = 1; step < 5; step++) {
 const x = r + dx * step;
 const y = c + dy * step;
 if (x >= size || y >= size || y < 0 || board[x * size + y] !== board[start]) break;
 count++;
 }
 if (count === 5) return board[start];
 }
 }
 }
 return null;
 }

 return (
 <div 
 className="flex flex-col items-center min-h-screen text-white"
 style={{ backgroundImage: "url('https://png.pngtree.com/background/20230520/original/pngtree-futuristic-image-with-led-lights-and-large-cubes-picture-image_2679465.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
 >
 <h1 className="text-3xl font-bold mb-4">Gomoku: You (O) vs Bot (X)</h1>
 <div className="grid gap-1 p-2 bg-gray-900 bg-opacity-70 rounded-lg" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
 {board.map((cell, i) => (
 <button
 key={i}
 onClick={() => handleClick(i)}
 disabled={cell || winner || !isPlayerTurn}
 className="w-10 h-10 flex items-center justify-center bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700"
 >
 {cell}
 </button>
 ))}
 </div>
 {winner && <p className="mt-4 text-xl font-semibold">{winner === "O" ? "You Win!" : "Bot Wins!"}</p>}
 {isDraw && <p className="mt-4 text-xl font-semibold">It's a Draw!</p>}
 <button
 onClick={() => {
 setBoard(Array(size * size).fill(null));
 setIsPlayerTurn(true);
 }}
 className="mt-4 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
 >
 Reset
 </button>
 <button
 onClick={() => navigate("/")}
 className="px-6 py-2 mt-4 bg-blue-500 rounded-lg hover:bg-blue-600"
 >
 Back
 </button>
 </div>
 );
}
