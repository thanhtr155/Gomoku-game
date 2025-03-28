package com.btec.gomoku_game.controllers;

import com.btec.gomoku_game.entities.GameRoom;
import com.btec.gomoku_game.security.JwtUtil;
import com.btec.gomoku_game.services.GameRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/games")
public class GameRoomController {
    @Autowired
    private GameRoomService gameRoomService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private String authenticate(String authHeader) throws Exception {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new Exception("No valid Authorization header");
        }
        String token = authHeader.substring(7);
        if (JwtUtil.verifyToken(token)) {
            return JwtUtil.getEmailFromToken(token);
        }
        throw new Exception("Invalid token");
    }

    @PostMapping("/create")
    public ResponseEntity<GameRoom> createRoom(@RequestHeader("Authorization") String authHeader,
                                               @RequestBody Map<String, String> request) {
        try {
            String player1 = authenticate(authHeader);
            String roomId = request.get("roomId");

            if (roomId == null) {
                return ResponseEntity.badRequest().build();
            }

            GameRoom gameRoom = gameRoomService.createRoom(roomId, player1);
            return ResponseEntity.ok(gameRoom);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/join")
    public ResponseEntity<GameRoom> joinRoom(@RequestHeader("Authorization") String authHeader,
                                             @RequestBody Map<String, String> request) {
        try {
            String player2 = authenticate(authHeader);
            String roomId = request.get("roomId");

            if (roomId == null) {
                return ResponseEntity.badRequest().build();
            }

            Optional<GameRoom> roomOptional = gameRoomService.getGameById(roomId);
            if (!roomOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            GameRoom gameRoom = roomOptional.get();
            if (gameRoom.getPlayer2() != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            gameRoom = gameRoomService.joinRoom(roomId, player2);
            messagingTemplate.convertAndSend("/topic/game/" + roomId, gameRoom);
            return ResponseEntity.ok(gameRoom);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<GameRoom>> getAvailableRooms(@RequestHeader("Authorization") String authHeader) {
        try {
            authenticate(authHeader); // Chỉ cần xác thực, không cần lấy player
            List<GameRoom> availableRooms = gameRoomService.getGameById("")
                    .map(Collections::singletonList)
                    .orElseGet(Collections::emptyList)
                    .stream()
                    .filter(room -> room.getPlayer2() == null && !room.isFinished())
                    .collect(Collectors.toList());
            return ResponseEntity.ok(availableRooms);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}