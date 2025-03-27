import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BOARD_SIZE = 15;

const PlayOnline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, player } = location.state || {};

  const [client, setClient] = useState(null);
  const [board, setBoard] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(""))
  );
  const [currentTurn, setCurrentTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [error, setError] = useState(null); // Thêm state để hiển thị lỗi

  useEffect(() => {
    if (!roomId || !player) {
      navigate("/lobby");
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws/game");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: console.log,
      onConnect: () => {
        console.log("✅ Connected to WebSocket!");

        stompClient.subscribe(`/topic/game/${roomId}`, (message) => {
          const updatedGame = JSON.parse(message.body);
          console.log("🔄 Game State:", updatedGame);
          setBoard(updatedGame.board);
          setCurrentTurn(updatedGame.currentTurn);
          setWinner(updatedGame.winner);
          setPlayer1(updatedGame.player1);
          setPlayer2(updatedGame.player2);
          setError(null); // Xóa lỗi nếu nhận được trạng thái
        });

        stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
          const chat = JSON.parse(message.body);
          console.log("💬 Chat:", chat);
          setMessages((prev) => [...prev, `${chat.sender}: ${chat.content}`]);
        });

        stompClient.publish({
          destination: "/app/game/state",
          body: JSON.stringify({ roomId }),
        });

        // Timeout để kiểm tra nếu không nhận được trạng thái
        setTimeout(() => {
          if (!player1) {
            setError("Failed to load game state. Room may not exist.");
          }
        }, 5000);
      },
      onStompError: (error) => {
        console.error("WebSocket Error:", error);
        setError("Failed to connect to game server.");
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, [roomId, player, navigate]);

  const sendMove = (row, col) => {
    if (!client) {
      console.log("Move blocked: Client not ready");
      return;
    }
    if (board[row][col]) {
      console.log("Move blocked: Cell already taken");
      return;
    }
    if (winner) {
      console.log("Move blocked: Game is over");
      return;
    }
    if (!player1 || !player2) {
      console.log("Move blocked: Game state not loaded");
      return;
    }

    const mySymbol = player === player1 ? "X" : "O";
    if (mySymbol !== currentTurn) {
      console.log("Move blocked: Not your turn!");
      return;
    }

    console.log(`Sending move: ${player} (${mySymbol}) to (${row}, ${col})`);
    client.publish({
      destination: "/app/game/move",
      body: JSON.stringify({ roomId, row, col, player }),
    });
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!client || !chatInput.trim()) return;

    console.log(`Sending chat: ${player}: ${chatInput}`);
    client.publish({
      destination: "/app/game/chat",
      body: JSON.stringify({ roomId, sender: player, content: chatInput }),
    });
    setChatInput("");
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-3xl font-bold my-4">Gomoku - Room</h1>
      <h2>Code "{roomId}" - Share code with your friends</h2>
      <p className="text-lg">You are: <strong>{player}</strong> ({player === player1 ? "X" : player === player2 ? "O" : "Loading..."})</p>
      <p className="text-lg">
        Players: <strong>{player1 || "Waiting..."}</strong> (X) vs{" "}
        <strong>{player2 || "Waiting..."}</strong> (O)
      </p>
      <p className="text-lg">Current Turn: <strong>{currentTurn}</strong></p>
      {winner && <p className="text-2xl mt-4">Winner: {winner}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div
        className="grid gap-1 mt-4"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          border: "2px solid white",
        }}
      >
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <button
              key={`${rIdx}-${cIdx}`}
              onClick={() => sendMove(rIdx, cIdx)}
              className={`w-8 h-8 border flex items-center justify-center ${
                cell === "X"
                  ? "bg-blue-500 text-white"
                  : cell === "O"
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
              disabled={winner || !player1 || !player2 || (player === player1 ? currentTurn !== "X" : currentTurn !== "O")}
            >
              {cell || ""}
            </button>
          ))
        )}
      </div>

      <div className="mt-6 w-1/2">
        <h3 className="text-xl font-bold">Chat</h3>
        <div className="h-40 bg-gray-800 p-2 overflow-y-auto rounded">
          {messages.map((msg, idx) => (
            <p key={idx} className="text-sm">{msg}</p>
          ))}
        </div>
        <form onSubmit={sendChat} className="mt-2 flex">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 p-2 bg-gray-700 text-white rounded-l"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r"
          >
            Send
          </button>
        </form>
      </div>

      <button
        onClick={() => navigate("/lobby")}
        className="mt-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg"
      >
        Exit Game
      </button>
    </div>
  );
};

export default PlayOnline;