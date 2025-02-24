package com.btec.gomoku_game.repositories;

import org.springframework.stereotype.Repository;
import com.btec.gomoku_game.entities.GameState;
import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface GameRepository extends MongoRepository<GameState, String> {
}