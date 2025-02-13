package com.btec.game_caro_api.repositories;

import com.btec.game_caro_api.entities.Product;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    // Additional query methods if needed

}
