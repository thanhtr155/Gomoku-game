package com.btec.gomoku_game.configs;

import com.btec.gomoku_game.entities.ChatMessage;
import com.btec.gomoku_game.entities.GameMove;
import com.btec.gomoku_game.entities.GameRoom;
import com.btec.gomoku_game.services.GameRoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
public class WebSocketGameHandler {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketGameHandler.class);

    @Autowired
    private GameRoomService gameRoomService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private Map<String, String> sessionToRoomMap = new HashMap<>();

    public static class ErrorMessage {
        private String message;
        public ErrorMessage(String message) { this.message = message; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    @MessageMapping("/game/move")
    public void processMove(GameMove move) throws Exception {
        logger.info("Received move: {} at ({}, {}) in room {}", move.getPlayer(), move.getRow(), move.getCol(), move.getRoomId());
        try {
            GameRoom updatedRoom = gameRoomService.makeMove(move.getRoomId(), move.getRow(), move.getCol(), move.getPlayer());
            messagingTemplate.convertAndSend("/topic/game/" + move.getRoomId(), updatedRoom);
        } catch (IllegalArgumentException e) {
            messagingTemplate.convertAndSend("/topic/game/" + move.getRoomId(), new ErrorMessage("Error: " + e.getMessage()));
        }
    }

    @MessageMapping("/game/state")
    public void sendGameState(GameMove move) {
        logger.info("Received state request for room: {}", move.getRoomId());
        Optional<GameRoom> gameRoom = gameRoomService.getGameById(move.getRoomId());
        if (gameRoom.isPresent()) {
            messagingTemplate.convertAndSend("/topic/game/" + move.getRoomId(), gameRoom.get());
            logger.info("Sent game state: {}", gameRoom.get());
        } else {
            logger.warn("Room not found: {}", move.getRoomId());
        }
    }

    @MessageMapping("/game/chat")
    public void processChat(ChatMessage message) {
        logger.info("Received chat: {}: {} in room {}", message.getSender(), message.getContent(), message.getRoomId());
        messagingTemplate.convertAndSend("/topic/chat/" + message.getRoomId(), message);
    }

    @EventListener
    public void handleConnect(SessionConnectEvent event) {
        Map<String, Object> attributes = event.getMessage().getHeaders().get("simpSessionAttributes", Map.class);
        if (attributes != null) {
            String sessionId = (String) attributes.get("sessionId");
            String roomId = (String) attributes.get("roomId");
            if (sessionId != null && roomId != null) {
                sessionToRoomMap.put(sessionId, roomId);
                logger.info("Registered session {} for room {} on connect", sessionId, roomId);
            }
        }
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        String roomId = sessionToRoomMap.remove(sessionId);
        if (roomId != null) {
            logger.info("Player disconnected from room: {}", roomId);
            messagingTemplate.convertAndSend("/topic/game/" + roomId, new ErrorMessage("Opponent disconnected"));
        }
    }
}