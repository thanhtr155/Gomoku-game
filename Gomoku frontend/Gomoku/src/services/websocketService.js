// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

// const SOCKET_URL = "http://localhost:8080/gomoku-websocket";


// let stompClient = null;

// export const connectWebSocket = (onMoveReceived) => {
//   const socket = new SockJS(SOCKET_URL);
//   stompClient = new Client({
//     webSocketFactory: () => socket,
//     reconnectDelay: 5000, 
//     onConnect: () => {
//       console.log("Connected to WebSocket");
//       stompClient.subscribe("/topic/game", (message) => {
//         const move = JSON.parse(message.body);
//         onMoveReceived(move); 
//       });
//     },
//     onStompError: (frame) => {
//       console.error("WebSocket Error:", frame.headers["message"]);
//     },
//   });

//   stompClient.activate();
// };

// export const sendMove = (gameId, player, row, col) => {
//   if (stompClient && stompClient.connected) {
//     stompClient.publish({
//       destination: "/app/move",
//       body: JSON.stringify({ gameId, player, row, col }),
//     });
//   } else {
//     console.error("WebSocket is not connected!");
//   }
// };

// export const disconnectWebSocket = () => {
//   if (stompClient) {
//     stompClient.deactivate();
//   }
// };
