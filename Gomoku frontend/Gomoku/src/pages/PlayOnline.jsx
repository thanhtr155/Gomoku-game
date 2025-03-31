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
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rematchRequested, setRematchRequested] = useState(false);
  const [rematchRequestFrom, setRematchRequestFrom] = useState(null);
  const [rematchDeclined, setRematchDeclined] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    console.log("PlayOnline: Checking location.state:");
    console.log("roomId:", roomId);
    console.log("player:", player);

    if (!roomId || !player) {
      console.log("No roomId or player found, redirecting to /lobby");
      navigate("/lobby");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("PlayOnline: Checking token in localStorage:", token);

    if (!token) {
      console.log("No token found, redirecting to /login");
      navigate("/login");
      return;
    }

    const fetchRoomState = async () => {
      try {
        console.log(`Fetching room state for roomId: ${roomId}`);
        const response = await fetch(`http://localhost:8080/api/games/get/${roomId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.log("Error response:", errorData);
          throw new Error(errorData.message || "Failed to fetch room state");
        }

        const gameState = await response.json();
        console.log("Fetched room state:", gameState);
        setBoard(gameState.board || Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill("")));
        setCurrentTurn(gameState.currentTurn || "X");
        setWinner(gameState.winner || null);
        setPlayer1(gameState.player1 || null);
        setPlayer2(gameState.player2 || null);
        setIsGameFinished(gameState.finished || false);
        setIsLoading(false);
        setRematchRequested(gameState.player1 === player ? gameState.player1WantsRematch : gameState.player2WantsRematch);
        setRematchRequestFrom(
          gameState.player1WantsRematch && gameState.player1 !== player ? gameState.player1 :
          gameState.player2WantsRematch && gameState.player2 !== player ? gameState.player2 : null
        );
      } catch (error) {
        console.error("Error fetching room state:", error);
        setError(`Failed to fetch room state: ${error.message}. Please try again.`);
      }
    };

    const socket = new SockJS(
      `http://localhost:8080/ws/game?roomId=${roomId}&token=Bearer ${token}`
    );
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: console.log,
      onConnect: () => {
        console.log("✅ Connected to WebSocket!");
        stompClient.subscribe(`/topic/game/${roomId}`, (message) => {
          const gameState = JSON.parse(message.body);
          console.log("Received game state:", gameState);

          // Kiểm tra nếu gameState là ErrorMessage
          if (gameState.message) {
            setNotification(gameState.message);
            setTimeout(() => {
              navigate("/lobby");
            }, 2000);
            return;
          }

          // Nếu không phải ErrorMessage, cập nhật trạng thái game
          setBoard(gameState.board || Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill("")));
          setCurrentTurn(gameState.currentTurn || "X");
          setWinner(gameState.winner || null);
          setPlayer1(gameState.player1 || null);
          setPlayer2(gameState.player2 || null);
          setIsGameFinished(gameState.finished || false);
          setIsLoading(false);

          // Kiểm tra nếu player1 rời phòng (player1 = null)
          if (gameState.player1 === null && gameState.player2 !== null) {
            setNotification("The room creator has left. Returning to lobby...");
            setTimeout(() => {
              navigate("/lobby");
            }, 2000);
            return;
          }

          // Cập nhật trạng thái rematch
          const isPlayer1 = gameState.player1 === player;
          const playerWantsRematch = isPlayer1 ? gameState.player1WantsRematch : gameState.player2WantsRematch;
          const otherPlayerWantsRematch = isPlayer1 ? gameState.player2WantsRematch : gameState.player1WantsRematch;
          const otherPlayerEmail = isPlayer1 ? gameState.player2 : gameState.player1;

          setRematchRequested(playerWantsRematch || false);
          setRematchRequestFrom(
            otherPlayerWantsRematch && otherPlayerEmail !== player ? otherPlayerEmail : null
          );

          // Nếu một trong hai người từ chối rematch, hiển thị thông báo và quay lại lobby
          if (gameState.rematchDeclined) {
            setRematchDeclined(true);
            setNotification("Rematch declined. Returning to lobby...");
            setTimeout(() => {
              navigate("/lobby");
            }, 2000);
            return;
          }

          // Nếu cả hai người chơi đồng ý rematch, reset trạng thái và thông báo
          if (gameState.player1WantsRematch && gameState.player2WantsRematch) {
            setRematchRequested(false);
            setRematchRequestFrom(null);
            setRematchDeclined(false);
            setNotification("Starting a new game!");
            setWinner(null);
          }
          // Nếu ván đấu chưa kết thúc, xóa thông báo rematch
          else if (!gameState.finished) {
            setNotification(null);
          }
          // Nếu đang chờ phản hồi rematch và ván đấu đã kết thúc
          else if (playerWantsRematch && !otherPlayerWantsRematch && gameState.finished) {
            setNotification("Waiting for the other player to respond...");
          }
        });

        stompClient.subscribe(`/topic/game/${roomId}/chat`, (message) => {
          const chatMessage = JSON.parse(message.body);
          console.log("Received chat message:", chatMessage);
          if (chatMessage.sender !== player) {
            setMessages((prev) => [
              ...prev,
              {
                sender: chatMessage.sender,
                content: chatMessage.content,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          }
        });

        fetchRoomState();
      },
      onStompError: (error) => {
        console.error("WebSocket Error:", error);
        setError("Failed to connect to game server. Please try again.");
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [roomId, player, navigate]);

  const sendMove = (row, col) => {
    if (!client) {
      setNotification("Client not ready. Please wait...");
      return;
    }
    if (board[row][col]) {
      setNotification("This position is already taken.");
      return;
    }
    if (winner) {
      setNotification("Game is over. Start a new game to continue.");
      return;
    }
    if (!player1 || !player2) {
      setNotification("Game state not loaded. Please wait...");
      return;
    }

    const mySymbol = player === player1 ? "X" : "O";
    if (mySymbol !== currentTurn) {
      setNotification("It's not your turn!");
      return;
    }

    console.log(`Sending move: ${player} (${mySymbol}) to (${row}, ${col})`);
    client.publish({
      destination: "/app/game/move",
      body: JSON.stringify({ roomId, row, col, playerSymbol: mySymbol }),
    });
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!client || !chatInput.trim()) return;

    console.log(`Sending chat: ${player}: ${chatInput}`);
    const timestamp = new Date().toLocaleTimeString();
    setMessages((prev) => [
      ...prev,
      {
        sender: player,
        content: chatInput,
        timestamp: timestamp,
      },
    ]);
    client.publish({
      destination: "/app/game/chat",
      body: JSON.stringify({ roomId, sender: player, content: chatInput }),
    });
    setChatInput("");
  };

  const leaveRoom = () => {
    if (!client) {
      navigate("/lobby");
      return;
    }

    console.log(`Leaving room: ${roomId}`);
    client.publish({
      destination: "/app/game/leave",
      body: JSON.stringify({ roomId, playerEmail: player }),
    });

    setTimeout(() => navigate("/lobby"), 500);
  };

  const requestRematch = () => {
    if (!client) {
      setNotification("Client not ready. Please wait...");
      return;
    }

    console.log(`Requesting rematch from ${player} in room ${roomId}`);
    client.publish({
      destination: "/app/game/rematch/request",
      body: JSON.stringify({ roomId, playerEmail: player }),
    });
    setRematchRequested(true);
    setNotification("Waiting for the other player to respond...");
  };

  const respondToRematch = (accepted) => {
    if (!client) {
      setNotification("Client not ready. Please wait...");
      return;
    }

    console.log(`Responding to rematch: ${accepted} from ${player} in room ${roomId}`);
    client.publish({
      destination: "/app/game/rematch/respond",
      body: JSON.stringify({ roomId, playerEmail: player, accepted }),
    });
    if (!accepted) {
      setRematchDeclined(true);
      setNotification("Rematch declined. Returning to lobby...");
      setTimeout(() => {
        navigate("/lobby");
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-4">
        <h1 className="text-3xl font-bold my-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center text-white p-6" style={{ backgroundImage: `url('https://img6.thuthuatphanmem.vn/uploads/2022/03/16/background-den-led-chuyen-sac_085304512.jpg')` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-indigo-900/50 animate-gradient-shift"></div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold my-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 animate-text-glow">
          Gomoku - Room
        </h1>
        <h2 className="text-gray-300 animate-text-reveal text-center">Code "{roomId}" - Share code with your friends</h2>
        <p className="text-lg text-teal-300 animate-text-reveal text-center">
          You are: <strong>{player}</strong> (
          {player === player1 ? "X" : player === player2 ? "O" : "Loading..."})
        </p>
        <p className="text-lg text-gray-300 animate-text-reveal text-center">
          Players: <strong>{player1 || "Waiting..."}</strong> (X) vs{" "}
          <strong>{player2 || "Waiting..."}</strong> (O)
        </p>
        <p className="text-lg text-yellow-300 animate-text-reveal text-center">
          Current Turn: <strong>{currentTurn}</strong>
        </p>
        {winner && (
          <p className="text-3xl mt-6 text-green-400 animate-text-reveal text-center">Winner: {winner}</p>
        )}
        {error && <p className="text-red-400 mt-6 animate-text-reveal text-center">{error}</p>}
        {notification && (
          <p className="text-yellow-400 mt-6 animate-text-reveal text-center">{notification}</p>
        )}

        {winner && !rematchRequested && !rematchDeclined && (
          <div className="flex justify-center mt-6">
            <button
              onClick={requestRematch}
              className="relative px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-xl hover:from-green-600 hover:to-teal-700 transform hover:scale-110 hover:rotate-2 transition-all duration-500 group overflow-hidden"
            >
              <span className="relative z-10">Rematch</span>
              <span className="absolute inset-0 bg-green-400 opacity-0 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></span>
            </button>
          </div>
        )}

        {rematchRequestFrom && !rematchRequested && !rematchDeclined && (
          <div className="mt-6 animate-fade-slide-up flex flex-col items-center">
            <p className="text-lg text-gray-300 animate-text-reveal text-center">
              {rematchRequestFrom} wants to rematch. Do you agree?
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => respondToRematch(true)}
                className="relative px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-xl hover:from-green-600 hover:to-teal-700 transform hover:scale-110 transition-all duration-500 group overflow-hidden"
              >
                <span className="relative z-10">Yes</span>
                <span className="absolute inset-0 bg-green-400 opacity-0 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></span>
              </button>
              <button
                onClick={() => respondToRematch(false)}
                className="relative px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg shadow-xl hover:from-red-600 hover:to-pink-700 transform hover:scale-110 transition-all duration-500 group overflow-hidden"
              >
                <span className="relative z-10">No</span>
                <span className="absolute inset-0 bg-red-400 opacity-0 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></span>
              </button>
            </div>
          </div>
        )}

        {board && Array.isArray(board) ? (
          <div
            className="grid gap-1 mt-8 bg-gray-800/80 rounded-xl p-6 shadow-2xl animate-fade-slide-up"
            style={{
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
              border: "2px solid #4b5563",
            }}
          >
            {board.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => sendMove(rIdx, cIdx)}
                  className={`w-12 h-12 flex items-center justify-center rounded-md shadow-lg transition-all duration-300 transform hover:scale-110 ${
                    cell === "X"
                      ? "bg-blue-600 text-white animate-pulse"
                      : cell === "O"
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-gray-700 hover:bg-gray-600 animate-bounce-in"
                  }`}
                  disabled={
                    winner ||
                    !player1 ||
                    !player2 ||
                    (player === player1 ? currentTurn !== "X" : currentTurn !== "O")
                  }
                >
                  {cell || ""}
                </button>
              ))
            )}
          </div>
        ) : (
          <p className="text-red-400 mt-6 animate-text-reveal text-center">Error: Game board is not available.</p>
        )}

        <div className="mt-8 w-full max-w-md animate-fade-slide-up flex flex-col items-center">
          <h3 className="text-2xl font-bold text-teal-400 animate-text-reveal text-center">Chat</h3>
          <div className="h-40 bg-gray-800/80 p-4 rounded-xl shadow-lg overflow-y-auto w-full">
            {messages.map((msg, idx) => (
              <p
                key={idx}
                className={`text-sm mb-2 ${
                  msg.sender === player
                    ? "text-right text-blue-300 animate-text-reveal"
                    : "text-left text-green-300 animate-text-reveal"
                }`}
              >
                <span className="text-gray-500 text-xs">[{msg.timestamp}] </span>
                <span className="font-bold">{msg.sender}:</span> {msg.content}
              </p>
            ))}
          </div>
          <form onSubmit={sendChat} className="mt-4 flex justify-center w-full">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 p-3 bg-gray-700/80 text-white rounded-l-lg shadow-lg focus:ring-4 focus:ring-blue-500/50 focus:outline-none transform hover:scale-105 transition-all duration-500 animate-bounce-in"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-r-lg shadow-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-110 transition-all duration-500 group overflow-hidden"
            >
              <span className="relative z-10">Send</span>
              <span className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></span>
            </button>
          </form>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={leaveRoom}
            className="relative px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg shadow-xl hover:from-gray-700 hover:to-gray-800 transform hover:scale-110 hover:rotate-2 transition-all duration-500 group overflow-hidden"
          >
            <span className="relative z-10">Exit Game</span>
            <span className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></span>
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
};

export default PlayOnline;