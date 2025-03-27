package com.btec.gomoku_game.controllers;

import com.btec.gomoku_game.entities.GameRoom;
import com.btec.gomoku_game.services.GameRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/games")
public class GameRoomController {
    @Autowired
    private GameRoomService gameRoomService;
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/create")
    public ResponseEntity<GameRoom> createRoom(@RequestBody Map<String, String> request) {
        String roomId = request.get("roomId");
        String player1 = request.get("player1");

        if (roomId == null || player1 == null) {
            return ResponseEntity.badRequest().build();
        }

        GameRoom gameRoom = gameRoomService.createRoom(roomId, player1);
        return ResponseEntity.ok(gameRoom);
    }

    

    @PostMapping("/join")
    public ResponseEntity<GameRoom> joinRoom(@RequestBody Map<String, String> request) {
        String roomId = request.get("roomId");
        String player2 = request.get("player2");

        if (roomId == null || player2 == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<GameRoom> roomOptional = gameRoomService.getGameById(roomId);
        if (!roomOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        GameRoom gameRoom = roomOptional.get();
        if (gameRoom.getPlayer2() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Phòng đã đầy
        }

        gameRoom = gameRoomService.joinRoom(roomId, player2);
        return ResponseEntity.ok(gameRoom);
    }

    public GameRoom joinRoom(String roomId, String player2) {
        Optional<GameRoom> roomOptional = gameRoomRepository.findByRoomId(roomId);
        if (roomOptional.isPresent()) {
            GameRoom gameRoom = roomOptional.get();
            if (gameRoom.getPlayer2() != null) {
                throw new IllegalArgumentException("Room is full");
            }
            if (gameRoom.getPlayer1().equals(player2)) {
                throw new IllegalArgumentException("Cannot join as the same player");
            }
            gameRoom.setPlayer2(player2);
            GameRoom updatedRoom = gameRoomRepository.save(gameRoom);
            messagingTemplate.convertAndSend("/topic/game/" + roomId, updatedRoom); // Thông báo phòng đã sẵn sàng
            return updatedRoom;
        }
        throw new RuntimeException("Room not found");
    }
}
