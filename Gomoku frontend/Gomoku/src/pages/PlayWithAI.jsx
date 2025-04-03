import React, { useState, useEffect } from 'react';

const PlayWithAI = () => {
  const SIZE = 15;
  const WIN_COUNT = 5;
  const initialBoard = Array(SIZE * SIZE).fill(0);
  
  const [board, setBoard] = useState(initialBoard);
  const [gameStatus, setGameStatus] = useState('ongoing');
  const [currentTurn, setCurrentTurn] = useState('player');
  const [lastMove, setLastMove] = useState(null);

  const checkWin = (board, row, col, player) => {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of directions) {
      let count = 1;
      for (let i = 1; i < WIN_COUNT; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || board[r * SIZE + c] !== player) break;
        count++;
      }
      for (let i = 1; i < WIN_COUNT; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || board[r * SIZE + c] !== player) break;
        count++;
      }
      if (count >= WIN_COUNT) return true;
    }
    return false;
  };

  const checkDraw = (board) => board.every(cell => cell !== 0);

  // Lấy các nước đi tiềm năng với ưu tiên cao
  const getPotentialMoves = (board) => {
    const moves = new Set();
    const range = 2;
    const occupied = board.map((cell, i) => cell !== 0 ? i : -1).filter(i => i !== -1);

    if (occupied.length === 0) {
      moves.add(Math.floor(SIZE / 2) * SIZE + Math.floor(SIZE / 2));
      return Array.from(moves);
    }

    for (const index of occupied) {
      const row = Math.floor(index / SIZE);
      const col = index % SIZE;
      for (let r = Math.max(0, row - range); r <= Math.min(SIZE - 1, row + range); r++) {
        for (let c = Math.max(0, col - range); c <= Math.min(SIZE - 1, col + range); c++) {
          const newIndex = r * SIZE + c;
          if (board[newIndex] === 0) moves.add(newIndex);
        }
      }
    }
    return Array.from(moves);
  };

  // Hàm kiểm tra chuỗi và trả về thông tin chi tiết
  const checkSequence = (board, row, col, player, dr, dc) => {
    let count = 0;
    let openEnds = 0;
    let startR = row, startC = col;
    let endR = row, endC = col;

    // Đếm về phía trước
    for (let i = 0; i < WIN_COUNT; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || board[r * SIZE + c] !== player) break;
      count++;
      endR = r;
      endC = c;
    }

    // Đếm về phía sau
    for (let i = 1; i < WIN_COUNT; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || board[r * SIZE + c] !== player) break;
      count++;
      startR = r;
      startC = c;
    }

    // Kiểm tra đầu mở
    const beforeR = startR - dr;
    const beforeC = startC - dc;
    if (beforeR >= 0 && beforeR < SIZE && beforeC >= 0 && beforeC < SIZE && board[beforeR * SIZE + beforeC] === 0) {
      openEnds++;
    }
    const afterR = endR + dr;
    const afterC = endC + dc;
    if (afterR >= 0 && afterR < SIZE && afterC >= 0 && afterC < SIZE && board[afterR * SIZE + afterC] === 0) {
      openEnds++;
    }

    return { count, openEnds, start: { row: startR, col: startC }, end: { row: endR, col: endC } };
  };

  // Tìm nước đi để thắng hoặc chặn ngay
  const findImmediateMove = (board, player) => {
    const opponent = player === 1 ? 2 : 1;
    const moves = getPotentialMoves(board);
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    // Kiểm tra thắng ngay cho player
    for (const move of moves) {
      const row = Math.floor(move / SIZE);
      const col = move % SIZE;
      const newBoard = [...board];
      newBoard[move] = player;
      if (checkWin(newBoard, row, col, player)) return move;
    }

    // Kiểm tra chặn chuỗi 4 mở của đối thủ
    for (const index of board.map((cell, i) => cell === opponent ? i : -1).filter(i => i !== -1)) {
      const row = Math.floor(index / SIZE);
      const col = index % SIZE;
      for (const [dr, dc] of directions) {
        const { count, openEnds, start, end } = checkSequence(board, row, col, opponent, dr, dc);
        if (count === 4 && openEnds > 0) {
          const beforeR = start.row - dr;
          const beforeC = start.col - dc;
          const afterR = end.row + dr;
          const afterC = end.col + dc;
          if (beforeR >= 0 && beforeR < SIZE && beforeC >= 0 && beforeC < SIZE && board[beforeR * SIZE + beforeC] === 0) {
            return beforeR * SIZE + beforeC;
          }
          if (afterR >= 0 && afterR < SIZE && afterC >= 0 && afterC < SIZE && board[afterR * SIZE + afterC] === 0) {
            return afterR * SIZE + afterC;
          }
        }
      }
    }

    // Kiểm tra chặn chuỗi 3 mở 2 đầu của đối thủ
    for (const index of board.map((cell, i) => cell === opponent ? i : -1).filter(i => i !== -1)) {
      const row = Math.floor(index / SIZE);
      const col = index % SIZE;
      for (const [dr, dc] of directions) {
        const { count, openEnds, start, end } = checkSequence(board, row, col, opponent, dr, dc);
        if (count === 3 && openEnds === 2) {
          const beforeR = start.row - dr;
          const beforeC = start.col - dc;
          const afterR = end.row + dr;
          const afterC = end.col + dc;
          if (beforeR >= 0 && beforeR < SIZE && beforeC >= 0 && beforeC < SIZE && board[beforeR * SIZE + beforeC] === 0) {
            return beforeR * SIZE + beforeC;
          }
          if (afterR >= 0 && afterR < SIZE && afterC >= 0 && afterC < SIZE && board[afterR * SIZE + afterC] === 0) {
            return afterR * SIZE + afterC;
          }
        }
      }
    }

    return null;
  };

  // Hàm đánh giá nước đi
  const evaluateMove = (board, move, player) => {
    const opponent = player === 1 ? 2 : 1;
    const row = Math.floor(move / SIZE);
    const col = move % SIZE;
    let score = 0;

    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of directions) {
      for (const p of [player, opponent]) {
        const { count, openEnds } = checkSequence(board, row, col, p, dr, dc);
        if (count >= WIN_COUNT) {
          score += p === player ? 1000000 : -1000000;
        } else if (count === 4) {
          score += p === player ? (openEnds > 0 ? 10000 : 2000) : (openEnds > 0 ? -15000 : -3000);
        } else if (count === 3) {
          score += p === player ? (openEnds === 2 ? 2000 : openEnds === 1 ? 500 : 100) : (openEnds === 2 ? -3000 : openEnds === 1 ? -600 : -150);
        } else if (count === 2) {
          score += p === player ? (openEnds === 2 ? 200 : openEnds === 1 ? 50 : 10) : (openEnds === 2 ? -250 : openEnds === 1 ? -60 : -20);
        }
      }
    }
    return score;
  };

  const minimax = (board, depth, alpha, beta, isMaximizing) => {
    if (depth === 0) {
      const lastMoveIndex = board.lastIndexOf(isMaximizing ? 2 : 1);
      return evaluateMove(board, lastMoveIndex, 2);
    }

    const availableMoves = getPotentialMoves(board);
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = 2;
        const row = Math.floor(move / SIZE);
        const col = move % SIZE;
        if (checkWin(newBoard, row, col, 2)) return 1000000;
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = 1;
        const row = Math.floor(move / SIZE);
        const col = move % SIZE;
        if (checkWin(newBoard, row, col, 1)) return -1000000;
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  const findBestMove = (board) => {
    // Kiểm tra thắng ngay cho AI
    let immediateMove = findImmediateMove(board, 2);
    if (immediateMove !== null) return immediateMove;

    // Kiểm tra chặn người chơi
    immediateMove = findImmediateMove(board, 1);
    if (immediateMove !== null) return immediateMove;

    const DEPTH = 3;
    const availableMoves = getPotentialMoves(board);
    let bestMove = availableMoves[0];
    let bestValue = -Infinity;

    // Sắp xếp nước đi theo mức độ ưu tiên
    const sortedMoves = availableMoves.sort((a, b) => {
      const boardA = [...board];
      const boardB = [...board];
      boardA[a] = 2;
      boardB[b] = 2;
      return evaluateMove(boardB, b, 2) - evaluateMove(boardA, a, 2);
    });

    for (const move of sortedMoves) {
      const newBoard = [...board];
      newBoard[move] = 2;
      const moveValue = minimax(newBoard, DEPTH - 1, -Infinity, Infinity, false);
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    }
    return bestMove;
  };

  const aiMove = () => {
    const bestMove = findBestMove(board);
    const newBoard = [...board];
    newBoard[bestMove] = 2;
    const row = Math.floor(bestMove / SIZE);
    const col = bestMove % SIZE;
    setBoard(newBoard);
    setLastMove({ row, col });
    if (checkWin(newBoard, row, col, 2)) {
      setGameStatus('ai_wins');
      setCurrentTurn(null);
    } else if (checkDraw(newBoard)) {
      setGameStatus('draw');
      setCurrentTurn(null);
    } else {
      setCurrentTurn('player');
    }
  };

  const handleCellClick = (index) => {
    if (currentTurn !== 'player' || gameStatus !== 'ongoing' || board[index] !== 0) return;
    const newBoard = [...board];
    newBoard[index] = 1;
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    setBoard(newBoard);
    setLastMove({ row, col });
    if (checkWin(newBoard, row, col, 1)) {
      setGameStatus('player_wins');
      setCurrentTurn(null);
    } else if (checkDraw(newBoard)) {
      setGameStatus('draw');
      setCurrentTurn(null);
    } else {
      setCurrentTurn('ai');
    }
  };

  useEffect(() => {
    if (currentTurn === 'ai' && gameStatus === 'ongoing') {
      setTimeout(aiMove, 200);
    }
  }, [currentTurn, gameStatus]);

  const resetGame = () => {
    setBoard(initialBoard);
    setGameStatus('ongoing');
    setCurrentTurn('player');
    setLastMove(null);
  };

  return (
    <div className="play-with-ai">
      <h1 className="title">Gomoku - Play with AI</h1>
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell === 1 ? 'player' : cell === 2 ? 'ai' : ''}`}
            onClick={() => handleCellClick(index)}
          >
            {cell === 1 ? 'X' : cell === 2 ? 'O' : ''}
          </div>
        ))}
      </div>
      <div className="info">
        <p>Trạng thái: {gameStatus === 'ongoing' ? 'Đang chơi' : 
                       gameStatus === 'player_wins' ? 'Bạn thắng!' : 
                       gameStatus === 'ai_wins' ? 'AI thắng!' : 'Hòa'}</p>
        <p>Lượt hiện tại: {currentTurn === 'player' ? 'Bạn (X)' : 'AI (O)'}</p>
        <p>Nước đi cuối: {lastMove ? `${lastMove.row}, ${lastMove.col}` : 'Chưa có'}</p>
        <button onClick={resetGame}>
          <span className="relative">Chơi lại</span>
          <span className="absolute"></span>
        </button>
      </div>

      <style jsx>{`
        .play-with-ai {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: url('https://img4.thuthuatphanmem.vn/uploads/2020/12/26/anh-nen-nhat-ban-2k_125909478.jpg') no-repeat center center/cover;
          padding: 20px;
          color: white;
        }

        .title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 20px;
          background: linear-gradient(to right, #dc2626, #f97316);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: text-glow 3s ease-in-out infinite;
        }

        .board {
          display: grid;
          gap: 2px;
          background-color: rgba(75, 85, 99, 0.8);
          border: 2px solid #4b5563;
          padding: 10px;
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          grid-template-columns: repeat(15, 1fr);
          grid-template-rows: repeat(15, 1fr);
          animation: fade-slide-up 0.8s ease-out;
        }

        .cell {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(55, 65, 81, 0.8);
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.5rem;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .cell:hover {
          background-color: rgba(75, 85, 99, 0.8);
          transform: scale(1.1);
          animation: bounce-in 0.6s ease-out;
        }

        .cell.player {
          background-color: #2563eb;
          color: white;
          animation: pulse 1s infinite;
        }

        .cell.ai {
          background-color: #dc2626;
          color: white;
          animation: pulse 1s infinite;
        }

        .info {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          background: rgba(31, 41, 55, 0.8);
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          animation: fade-slide-up 0.8s ease-out;
        }

        .info p {
          font-size: 1.25rem;
          font-weight: bold;
          color: #e5e7eb;
          animation: text-reveal 0.7s ease-out;
        }

        button {
          position: relative;
          padding: 12px 24px;
          background: linear-gradient(to right, #10b981, #059669);
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          color: white;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.5s ease;
        }

        button:hover {
          background: linear-gradient(to right, #059669, #047857);
          transform: scale(1.1) rotate(2deg);
        }

        button span.relative {
          position: relative;
          z-index: 10;
        }

        button span.absolute {
          position: absolute;
          inset: 0;
          background: #34d399;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        button:hover span.absolute {
          opacity: 0.4;
          animation: pulse 1s infinite;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }

        @keyframes text-glow {
          0% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.3); }
          50% { text-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 25px rgba(255, 255, 255, 0.8); }
          100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.3); }
        }

        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes fade-slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes text-reveal {
          0% { opacity: 0; filter: blur(3px); transform: translateY(10px); }
          100% { opacity: 1; filter: blur(0); transform: translateY(0); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default PlayWithAI;