package com.btec.gomoku_game.controllers;

import com.btec.gomoku_game.entities.GameState;
import com.btec.gomoku_game.entities.Move;
import com.btec.gomoku_game.repositories.GameRepository;
import com.btec.gomoku_game.repositories.MoveRepository;
import com.btec.gomoku_game.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@Controller
public class GomokuWebSocketController {
    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private MoveRepository moveRepository; // ✅ Store moves

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/move")
    public void makeMove(Move move, SimpMessageHeaderAccessor headerAccessor) {
        String token = (String) headerAccessor.getSessionAttributes().get("jwt");

        if (token == null) {
            throw new SecurityException("Unauthorized WebSocket request.");
        }

        try {
            Claims claims = JwtUtil.getClaimsFromToken(token);
            String userEmail = claims.getSubject(); // ✅ Extract user from JWT

            Optional<GameState> optionalGame = gameRepository.findById(move.getGameId());
            if (optionalGame.isPresent()) {
                GameState game = optionalGame.get();
                if (game.makeMove(move.getRow(), move.getCol(), move.getPlayer())) {
                    gameRepository.save(game);

                    // ✅ Save move in DB
                    Move newMove = new Move(move.getGameId(), move.getRow(), move.getCol(), move.getPlayer(), userEmail);
                    moveRepository.save(newMove);

                    // ✅ Send updated game state
                    messagingTemplate.convertAndSend("/topic/game", game);
                }
            }
        } catch (Exception e) {
            throw new SecurityException("Invalid JWT token: " + e.getMessage());
        }
    }
}
