package com.btec.gomoku_game.websocket;

import com.btec.gomoku_game.entities.GameMove;
import com.btec.gomoku_game.entities.GameRoom;
import com.btec.gomoku_game.services.GameRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@Controller
public class WebSocketGameHandler {
    @Autowired
    private GameRoomService gameRoomService;

    @MessageMapping("/game/move")
    @SendTo("/topic/game/{roomId}") // Broadcast move updates
    public GameRoom processMove(GameMove move) throws Exception {
        System.out.println("Move received: " + move.getPlayer() + " at (" + move.getRow() + "," + move.getCol() + ")");
        return gameRoomService.makeMove(move.getRoomId(), move.getRow(), move.getCol(), move.getPlayer());
    }

    @MessageMapping("/game/state")
    @SendTo("/topic/game/{roomId}") // Broadcast full game state
    public GameRoom sendGameState(GameMove move) {
        Optional<GameRoom> gameRoom = gameRoomService.getGameById(move.getRoomId());
        return gameRoom.orElse(null);
    }
}
