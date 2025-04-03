import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Lớp GomokuAI được chuyển từ Python sang JavaScript
class GomokuAI {
  constructor(size = 15) {
    this.size = size;
    this.qTable = {}; // Q-table sẽ được tải từ q_table.json
    this.learningRate = 0.1;
    this.discountFactor = 0.9;
    this.epsilon = 0.1;
  }

  // Tải Q-table từ dữ liệu JSON
  loadQTable(qTableData) {
    this.qTable = qTableData || {};
  }

  // Không cần saveQTable trong front-end
  saveQTable() {
    // Để trống vì không lưu trong front-end
  }

  // Chuyển trạng thái bàn cờ thành chuỗi
  boardToState(board) {
    return board.map(cell => (cell === null ? "0" : cell === "X" ? "1" : "2")).join("");
  }

  // Đánh giá bàn cờ
  evaluateBoard(board, player, opponent) {
    let score = 0;
    const board2D = this.to2DArray(board);

    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        for (const [di, dj] of directions) {
          const line = [];
          for (let k = -4; k < 5; k++) {
            const ni = i + k * di;
            const nj = j + k * dj;
            if (ni >= 0 && ni < this.size && nj >= 0 && nj < this.size) {
              line.push(board2D[ni][nj]);
            } else {
              line.push(null);
            }
          }
          score += this.evaluateLine(line, player, opponent);
          score -= this.evaluateLine(line, opponent, player) * 1.5;
        }
      }
    }
    return score;
  }

  // Đánh giá một dòng (5 ô liên tiếp)
  evaluateLine(line, player, opponent) {
    let score = 0;
    for (let i = 0; i <= line.length - 5; i++) {
      const window = line.slice(i, i + 5);
      const playerCount = window.filter(cell => cell === player).length;
      const noneCount = window.filter(cell => cell === null).length;

      if (playerCount === 5) {
        score += 100000;
      } else if (playerCount === 4 && noneCount === 1) {
        if (i > 0 && i + 5 < line.length && line[i - 1] === opponent) {
          score += 5000;
        } else {
          score += 10000;
        }
      } else if (playerCount === 3 && noneCount === 2) {
        score += 1000;
      } else if (playerCount === 2 && noneCount === 3) {
        score += 100;
      }
    }
    return score;
  }

  // Tìm các nước đi tiềm năng
  getPotentialMoves(board) {
    const potentialMoves = new Set();
    const board2D = this.to2DArray(board);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (board2D[i][j] !== null) {
          for (let di = -2; di <= 2; di++) {
            for (let dj = -2; dj <= 2; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (ni >= 0 && ni < this.size && nj >= 0 && nj < this.size && board2D[ni][nj] === null) {
                potentialMoves.add(ni * this.size + nj);
              }
            }
          }
        }
      }
    }

    return potentialMoves.size > 0
      ? Array.from(potentialMoves)
      : board.map((cell, i) => (cell === null ? i : null)).filter(i => i !== null);
  }

  // Chọn nước đi tốt nhất
  getBestMove(board, player = "X", opponent = "O") {
    const state = this.boardToState(board);
    const potentialMoves = this.getPotentialMoves(board);

    const bestDefensiveMove = this.findDefensiveMove(board, opponent, player);
    if (bestDefensiveMove !== null) {
      return bestDefensiveMove;
    }

    let bestScore = -Infinity;
    let bestMove = null;

    for (const move of potentialMoves) {
      if (board[move] !== null) continue;
      board[move] = player;
      const score = this.evaluateBoard(board, player, opponent);
      board[move] = null;

      const stateAction = `${state}_${move}`;
      const qValue = this.qTable[stateAction] || 0;
      const totalScore = score + qValue;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestMove = move;
      }
    }

    if (Math.random() < this.epsilon) {
      const availableMoves = potentialMoves.filter(i => board[i] === null);
      bestMove = availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : null;
    }

    return bestMove;
  }

  // Tìm nước đi phòng thủ
  findDefensiveMove(board, opponent, player) {
    const board2D = this.to2DArray(board);
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        for (const [di, dj] of directions) {
          const line = [];
          const positions = [];
          for (let k = -4; k < 5; k++) {
            const ni = i + k * di;
            const nj = j + k * dj;
            if (ni >= 0 && ni < this.size && nj >= 0 && nj < this.size) {
              line.push(board2D[ni][nj]);
              positions.push(ni * this.size + nj);
            } else {
              line.push(null);
              positions.push(null);
            }
          }

          for (let idx = 0; idx <= line.length - 5; idx++) {
            const window = line.slice(idx, idx + 5);
            const opponentCount = window.filter(cell => cell === opponent).length;
            const noneCount = window.filter(cell => cell === null).length;

            if (opponentCount === 4 && noneCount === 1) {
              const emptyIdx = window.indexOf(null) + idx;
              if (positions[emptyIdx] !== null) return positions[emptyIdx];
            } else if (opponentCount === 3 && noneCount === 2) {
              const emptyPositions = positions
                .slice(idx, idx + 5)
                .filter((pos, k) => window[k] === null && pos !== null);
              if (emptyPositions.length > 0) return emptyPositions[0];
            }
          }
        }
      }
    }
    return null;
  }

  // Chuyển mảng 1D thành 2D
  to2DArray(board) {
    const board2D = [];
    for (let i = 0; i < this.size; i++) {
      board2D.push(board.slice(i * this.size, (i + 1) * this.size));
    }
    return board2D;
  }
}

export default function PlayWithAI() {
  const navigate = useNavigate();
  const size = 15;
  const [board, setBoard] = useState(Array(size * size).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [ai, setAI] = useState(null);

  // Khởi tạo AI và tải Q-table
  useEffect(() => {
    async function initializeAI() {
      try {
        const aiInstance = new GomokuAI(size);
        const response = await fetch("/q_table.json");
        if (!response.ok) {
          throw new Error("Không thể tải q_table.json");
        }
        const qTableData = await response.json();
        aiInstance.loadQTable(qTableData);
        setAI(aiInstance);
      } catch (error) {
        console.error("Lỗi khi khởi tạo AI hoặc tải Q-table:", error);
      }
    }
    initializeAI();
  }, []);

  // Hàm chạy nước đi của AI
  function playAIMove(currentBoard) {
    if (!ai) return;

    const aiMove = ai.getBestMove([...currentBoard], "X", "O");
    if (aiMove !== null && aiMove !== undefined) {
      const newBoard = [...currentBoard];
      newBoard[aiMove] = "X";
      setBoard(newBoard);
      setIsPlayerTurn(true);
    } else {
      setIsPlayerTurn(true); // Nếu AI không tìm được nước đi, chuyển lượt lại cho người chơi
    }
  }

  const winner = calculateWinner(board, size);
  const isDraw = !winner && board.every(cell => cell !== null);

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

  function calculateWinner(board, size) {
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
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
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/background/20230520/original/pngtree-futuristic-image-with-led-lights-and-large-cubes-picture-image_2679465.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-3xl font-bold mb-4">Gomoku: You (O) vs Bot (X)</h1>
      <div
        className="grid gap-1 p-2 bg-gray-900 bg-opacity-70 rounded-lg"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
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
      {winner && (
        <p className="mt-4 text-xl font-semibold">{winner === "O" ? "You Win!" : "Bot Wins!"}</p>
      )}
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