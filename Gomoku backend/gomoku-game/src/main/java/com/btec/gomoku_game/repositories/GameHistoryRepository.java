package com.btec.gomoku_game.repositories;

import com.btec.gomoku_game.entities.GameHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameHistoryRepository extends MongoRepository<GameHistory, String> {
}