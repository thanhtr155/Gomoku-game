package com.btec.gomoku_game.repositories;

import com.btec.gomoku_game.entities.GameRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GameRoomRepository extends MongoRepository<GameRoom, String> {
    Optional<GameRoom> findByRoomId(String roomId);
}
