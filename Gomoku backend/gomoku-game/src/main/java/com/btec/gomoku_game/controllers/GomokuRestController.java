package com.btec.gomoku_game.controllers;

import com.btec.gomoku_game.entities.GameState;
import com.btec.gomoku_game.repositories.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/gomoku")
public class GomokuRestController {
    @Autowired
    private GameRepository gameRepository;

    @PostMapping("/create")
    public ResponseEntity<GameState> createGame() {
        GameState game = new GameState();
        gameRepository.save(game);
        return ResponseEntity.ok(game);
    }

    @GetMapping("/game/{id}")
    public ResponseEntity<GameState> getGame(@PathVariable String id) {
        Optional<GameState> game = gameRepository.findById(id);
        return game.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/games")
    public ResponseEntity<List<GameState>> getAllGames() {
        return ResponseEntity.ok(gameRepository.findAll());
    }
}
