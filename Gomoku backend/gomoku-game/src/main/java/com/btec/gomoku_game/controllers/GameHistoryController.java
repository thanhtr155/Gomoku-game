package com.btec.gomoku_game.controllers;

import com.btec.gomoku_game.entities.GameHistory;
import com.btec.gomoku_game.repositories.GameHistoryRepository;
import com.btec.gomoku_game.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game-history")
public class GameHistoryController {

    @Autowired
    private GameHistoryRepository gameHistoryRepository;

    @GetMapping
    public ResponseEntity<List<GameHistory>> getAllGameHistory(@RequestHeader("Authorization") String authHeader) {
        try {
            String username = authenticate(authHeader);
            System.out.println("GET /api/game-history called with auth: " + authHeader);
            return ResponseEntity.ok(gameHistoryRepository.findAll());
        } catch (Exception e) {
            System.out.println("Error in getAllGameHistory: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

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
}