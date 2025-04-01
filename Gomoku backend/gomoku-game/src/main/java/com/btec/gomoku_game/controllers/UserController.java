package com.btec.gomoku_game.controllers;

import com.btec.gomoku_game.entities.GameHistory;
import com.btec.gomoku_game.entities.User;
import com.btec.gomoku_game.repositories.GameHistoryRepository;
import com.btec.gomoku_game.security.JwtUtil;
import com.btec.gomoku_game.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private GameHistoryRepository gameHistoryRepository;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/game-history")
    public ResponseEntity<List<GameHistory>> getAllGameHistory(@RequestHeader("Authorization") String authHeader) {
        System.out.println("GET /api/users/game-history called with auth: " + authHeader);
        try {
            String username = authenticate(authHeader);
            System.out.println("Authenticated user: " + username);
            return ResponseEntity.ok(gameHistoryRepository.findAll());
        } catch (Exception e) {
            System.out.println("Error in getAllGameHistory: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    private String authenticate(String authHeader) throws Exception {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new Exception("No valid Authorization header");
        }
        String token = authHeader.substring(7);
        if (JwtUtil.verifyToken(token)) {
            return JwtUtil.getEmailFromToken(token); // Ở đây thực tế là username cho admin
        }
        throw new Exception("Invalid token");
    }
}
