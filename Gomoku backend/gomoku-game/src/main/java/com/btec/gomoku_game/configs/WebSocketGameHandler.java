package com.btec.gomoku_game.websocket;

import com.btec.gomoku_game.entities.ChatMessage;
import com.btec.gomoku_game.entities.GameMove;
import com.btec.gomoku_game.entities.GameRoom;
import com.btec.gomoku_game.services.GameRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Optional;

@Controller
public class WebSocketGameHandler {
    @Autowired
    private GameRoomService gameRoomService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/game/move")
    public void processMove(GameMove move) throws Exception {
        System.out.println("Received move: " + move.getPlayer() + " at (" + move.getRow() + "," + move.getCol() + ")");
        GameRoom updatedRoom = gameRoomService.makeMove(move.getRoomId(), move.getRow(), move.getCol(), move.getPlayer());
        messagingTemplate.convertAndSend("/topic/game/" + move.getRoomId(), updatedRoom);
    }

    @MessageMapping("/game/state")
    public void sendGameState(GameMove move) {
        System.out.println("Received state request for room: " + move.getRoomId());
        Optional<GameRoom> gameRoom = gameRoomService.getGameById(move.getRoomId());
        if (gameRoom.isPresent()) {
            messagingTemplate.convertAndSend("/topic/game/" + move.getRoomId(), gameRoom.get());
            System.out.println("Sent game state: " + gameRoom.get());
        } else {
            System.out.println("Room not found: " + move.getRoomId());
        }
    }

    @MessageMapping("/game/chat")
    public void processChat(ChatMessage message) {
        System.out.println("Received chat: " + message.getSender() + ": " + message.getContent());
        messagingTemplate.convertAndSend("/topic/chat/" + message.getRoomId(), message);
    }

    @EventListener
    public void handleWebSocketDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        // Tìm roomId liên quan đến sessionId (cần lưu mapping giữa session và roomId)
        messagingTemplate.convertAndSend("/topic/game/" + roomId, "Opponent disconnected");
    }
}
