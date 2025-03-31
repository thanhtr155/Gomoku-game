// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './PlayWithAI.css';

// const PlayWithAI = () => {
//   const SIZE = 15;
//   const initialBoard = Array(SIZE * SIZE).fill(0); // Bàn cờ 15x15, 0 là ô trống
//   const [board, setBoard] = useState(initialBoard);
//   const [gameStatus, setGameStatus] = useState('ongoing');
//   const [currentTurn, setCurrentTurn] = useState('ai'); // Bắt đầu với AI đi trước
//   const [aiMove, setAiMove] = useState(null);
//   const [moveCount, setMoveCount] = useState(0);

//   // Gọi API để lấy nước đi của AI khi đến lượt AI
//   const getAiMove = async (currentBoard) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/ai-move', { board: currentBoard });
//       const { row, col, game_status, next_turn, board: updatedBoard } = response.data;

//       if (response.data.error) {
//         throw new Error(response.data.error);
//       }

//       setAiMove({ row, col });
//       setBoard(updatedBoard);
//       setGameStatus(game_status);
//       setCurrentTurn(next_turn); // Cập nhật lượt đi dựa trên phản hồi từ API
//       setMoveCount((prev) => prev + 1);
//     } catch (error) {
//       console.error('Error getting AI move:', error.message);
//     }
//   };

//   // Gọi API để lấy nước đi của AI khi bắt đầu trò chơi hoặc khi đến lượt AI
//   useEffect(() => {
//     if (currentTurn === 'ai' && gameStatus === 'ongoing') {
//       getAiMove(board);
//     }
//   }, [currentTurn, gameStatus, moveCount]); // Thêm moveCount vào dependency để tránh gọi API nhiều lần

//   // Xử lý khi người chơi click vào ô trên bàn cờ
//   const handleCellClick = (index) => {
//     console.log('Cell clicked:', index, 'Current turn:', currentTurn, 'Game status:', gameStatus); // Ghi log để debug
//     if (currentTurn !== 'player' || gameStatus !== 'ongoing') {
//       console.log('Cannot move: Not your turn or game is over');
//       return; // Không cho phép người chơi đi nếu không phải lượt của họ hoặc trò chơi đã kết thúc
//     }

//     const row = Math.floor(index / SIZE);
//     const col = index % SIZE;

//     // Kiểm tra ô có trống không
//     if (board[index] !== 0) {
//       console.log('Cannot move: Cell is not empty');
//       return;
//     }

//     // Cập nhật bàn cờ với nước đi của người chơi (player 1)
//     const newBoard = [...board];
//     newBoard[index] = 1; // 1 là người chơi
//     setBoard(newBoard);
//     setMoveCount((prev) => prev + 1);

//     // Kiểm tra thắng/thua/hòa
//     if (checkWin(newBoard, row, col, 1)) {
//       setGameStatus('player_wins');
//       setCurrentTurn(null);
//     } else if (checkDraw(newBoard)) {
//       setGameStatus('draw');
//       setCurrentTurn(null);
//     } else {
//       setCurrentTurn('ai'); // Chuyển lượt cho AI
//     }
//   };

//   // Kiểm tra thắng
//   const checkWin = (board, row, col, player) => {
//     const directions = [
//       [0, 1], // Ngang
//       [1, 0], // Dọc
//       [1, 1], // Chéo chính
//       [1, -1], // Chéo phụ
//     ];

//     for (const [dr, dc] of directions) {
//       let count = 1;
//       for (let i = 1; i < 5; i++) {
//         const r = row + dr * i;
//         const c = col + dc * i;
//         if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || board[r * SIZE + c] !== player) {
//           break;
//         }
//         count++;
//       }
//       for (let i = 1; i < 5; i++) {
//         const r = row - dr * i;
//         const c = col - dc * i;
//         if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || board[r * SIZE + c] !== player) {
//           break;
//         }
//         count++;
//       }
//       if (count >= 5) {
//         return true;
//       }
//     }
//     return false;
//   };

//   // Kiểm tra hòa
//   const checkDraw = (board) => {
//     return board.every(cell => cell !== 0);
//   };

//   // Reset trò chơi
//   const resetGame = () => {
//     setBoard(initialBoard);
//     setGameStatus('ongoing');
//     setCurrentTurn('ai'); // AI đi trước
//     setAiMove(null);
//     setMoveCount(0);
//   };

//   // Quay lại trang chính
//   const goBack = () => {
//     window.location.href = '/'; // Điều hướng về trang chính
//   };

//   return (
//     <div className="play-with-ai">
//       <div className="board">
//         {board.map((cell, index) => (
//           <div
//             key={index}
//             className={`cell ${cell === 1 ? 'player' : cell === 2 ? 'ai' : ''}`}
//             onClick={() => handleCellClick(index)}
//           />
//         ))}
//       </div>
//       <div className="info">
//         <p>
//           Nước đi của AI:{' '}
//           {aiMove ? `${aiMove.row}, ${aiMove.col}` : 'Chưa có nước đi'}
//         </p>
//         <p>
//           ĐỢI LƯỢT CỦA {currentTurn === 'ai' ? 'AI' : 'BẠN'}
//         </p>
//         <p>Số ván huấn luyện: 24</p>
//         <p>Trung bình phần thưởng: 7239166666666664</p>
//         <button onClick={resetGame}>Chơi lại</button>
//         <button onClick={goBack}>Quay lại</button>
//       </div>
//     </div>
//   );
// };

// export default PlayWithAI;