package com.btec.game_caro_api.repositories;

// UserRepository.java
import com.btec.game_caro_api.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Additional query methods if needed
    Optional<User> findByEmail(String email);
}