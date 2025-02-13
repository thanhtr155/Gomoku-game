package com.btec.game_caro_api.repositories;

import com.btec.game_caro_api.entities.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    // Additional query methods if needed
}

