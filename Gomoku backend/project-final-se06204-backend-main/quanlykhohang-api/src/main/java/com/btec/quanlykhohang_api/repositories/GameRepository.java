package com.btec.quanlykhohang_api.repositories;

import org.springframework.stereotype.Repository;
import com.btec.quanlykhohang_api.entities.GameState;
import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface GameRepository extends MongoRepository<GameState, String> {
}