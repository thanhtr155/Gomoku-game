package com.btec.game_caro_api.controllers;

import com.btec.game_caro_api.entities.User;
import com.btec.game_caro_api.security.JwtUtil;
import com.btec.game_caro_api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/sign-up")
    public ResponseEntity<User> signUp(@RequestBody User user) {
        if (userService.getUserById(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build(); // Email already exists
        }
        User createdUser = userService.saveUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<Map<String, String>> signIn(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (userService.authenticate(email, password)) {
            String token = jwtUtil.generateToken(email);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
    }
}

