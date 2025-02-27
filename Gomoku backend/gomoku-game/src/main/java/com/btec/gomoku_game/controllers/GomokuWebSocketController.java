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

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class GomokuWebSocketController {
    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private MoveRepository moveRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // ✅ Store active games in memory
    private final Map<String, GameState> games = new ConcurrentHashMap<>();

    /**
     * ✅ Create a new game session
     */
    @MessageMapping("/create")
    public void createGame(SimpMessageHeaderAccessor headerAccessor) {
        String gameId = "game-" + System.currentTimeMillis();
        games.put(gameId, new GameState());

        // Notify all players about new game
        messagingTemplate.convertAndSend("/topic/lobby", games.keySet());
    }

    /**
     * ✅ Player joins an existing game
     */
    @MessageMapping("/join")
    public void joinGame(String gameId, SimpMessageHeaderAccessor headerAccessor) {
        if (!games.containsKey(gameId)) return;

        // Notify players that a player joined
        messagingTemplate.convertAndSend("/topic/game/" + gameId, "Player joined game: " + gameId);
    }

    /**
     * ✅ Handle moves & broadcast to specific game
     */
    @MessageMapping("/move")
    public void makeMove(Move move, SimpMessageHeaderAccessor headerAccessor) {
        String token = (String) headerAccessor.getSessionAttributes().get("jwt");

        if (token == null) {
            throw new SecurityException("Unauthorized WebSocket request.");
        }

        try {
            Claims claims = JwtUtil.getClaimsFromToken(token);
            String userEmail = claims.getSubject(); // ✅ Extract user from JWT

            String gameId = move.getGameId();
            GameState game = games.get(gameId);

            if (game != null && game.makeMove(move.getRow(), move.getCol(), move.getPlayer())) {
                gameRepository.save(game);

                // ✅ Save move in DB
                Move newMove = new Move(gameId, move.getRow(), move.getCol(), move.getPlayer(), userEmail);
                moveRepository.save(newMove);

                // ✅ Send updated game state only to players in this game
                messagingTemplate.convertAndSend("/topic/game/" + gameId, game);
            }
        } catch (Exception e) {
            throw new SecurityException("Invalid JWT token: " + e.getMessage());
        }
    }
}
