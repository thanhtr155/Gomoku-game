package com.btec.gomoku_game.repositories;

import com.btec.gomoku_game.entities.Move;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoveRepository extends MongoRepository<Move, String> {
    List<Move> findByGameId(String gameId); // ✅ Get moves for a specific game
}
