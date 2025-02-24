package com.btec.quanlykhohang_api.controllers;

import com.btec.quanlykhohang_api.entities.Move;
import com.btec.quanlykhohang_api.repositories.MoveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moves")
public class MoveController {
    @Autowired
    private MoveRepository moveRepository;

    @GetMapping("/{gameId}")
    public ResponseEntity<List<Move>> getMovesByGame(@PathVariable String gameId) {
        return ResponseEntity.ok(moveRepository.findByGameId(gameId));
    }
}
