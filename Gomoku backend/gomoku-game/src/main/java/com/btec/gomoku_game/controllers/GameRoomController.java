package com.btec.gomoku_game.controllers;

import com.btec.gomoku_game.entities.GameRoom;
import com.btec.gomoku_game.services.GameRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/games")
public class GameRoomController {
    @Autowired
    private GameRoomService gameRoomService;

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
}
