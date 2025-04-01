// src/main/java/com/btec/gomoku_game/repositories/AdminRepository.java
package com.btec.gomoku_game.repositories;

import com.btec.gomoku_game.entities.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AdminRepository extends MongoRepository<Admin, String> {
    Optional<Admin> findByUsername(String username);
}