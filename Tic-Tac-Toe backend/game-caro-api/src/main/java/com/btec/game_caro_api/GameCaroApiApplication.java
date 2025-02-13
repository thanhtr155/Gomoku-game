package com.btec.game_caro_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class GameCaroApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(GameCaroApiApplication.class, args);
	}

}
