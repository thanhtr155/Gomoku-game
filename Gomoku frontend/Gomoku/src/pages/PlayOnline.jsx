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
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-3xl font-bold my-4">Gomoku - Room</h1>
      <h2>Code "{roomId}" - Share code with your friends</h2>
      <p className="text-lg">
        You are: <strong>{player}</strong> (
        {player === player1 ? "X" : player === player2 ? "O" : "Loading..."})
      </p>
      <p className="text-lg">
        Players: <strong>{player1 || "Waiting..."}</strong> (X) vs{" "}
        <strong>{player2 || "Waiting..."}</strong> (O)
      </p>
      <p className="text-lg">
        Current Turn: <strong>{currentTurn}</strong>
      </p>
      {winner && <p className="text-2xl mt-4">Winner: {winner}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {notification && <p className="text-yellow-400 mt-4">{notification}</p>}

      {winner && !rematchRequested && !rematchDeclined && (
        <button
          onClick={requestRematch}
          className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg"
        >
          Rematch
        </button>
      )}

      {rematchRequestFrom && !rematchRequested && !rematchDeclined && (
        <div className="mt-4">
          <p className="text-lg">
            {rematchRequestFrom} wants to rematch. Do you agree?
          </p>
          <button
            onClick={() => respondToRematch(true)}
            className="mt-2 mr-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg"
          >
            Yes
          </button>
          <button
            onClick={() => respondToRematch(false)}
            className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
          >
            No
          </button>
        </div>
      )}

      {board && Array.isArray(board) ? (
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
        <p className="text-red-500 mt-4">Error: Game board is not available.</p>
      )}

      <div className="mt-6 w-1/2">
        <h3 className="text-xl font-bold">Chat</h3>
        <div className="h-40 bg-gray-800 p-2 overflow-y-auto rounded">
          {messages.map((msg, idx) => (
            <p
              key={idx}
              className={`text-sm mb-1 ${
                msg.sender === player ? "text-right text-blue-300" : "text-left text-green-300"
              }`}
            >
              <span className="text-gray-400 text-xs">[{msg.timestamp}] </span>
              <span className="font-bold">{msg.sender}:</span> {msg.content}
            </p>
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
        onClick={leaveRoom}
        className="mt-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg"
      >
        Exit Game
      </button>
    </div>
  );
};

export default PlayOnline;