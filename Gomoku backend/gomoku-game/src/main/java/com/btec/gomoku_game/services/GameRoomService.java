package com.btec.gomoku_game.services;

import com.btec.gomoku_game.entities.GameRoom;
import com.btec.gomoku_game.repositories.GameRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GameRoomService {
    @Autowired
    private GameRoomRepository gameRoomRepository;


    public GameRoom createRoom(String roomId, String player1) {
        GameRoom gameRoom = new GameRoom(roomId, player1);
        gameRoom.setCurrentTurn("X"); // Ensure X always starts
        return gameRoomRepository.save(gameRoom);
    }


    public GameRoom makeMove(String roomId, int row, int col, String player) throws Exception {
        Optional<GameRoom> roomOpt = gameRoomRepository.findByRoomId(roomId);
        if (!roomOpt.isPresent()) throw new Exception("Room not found");

        GameRoom gameRoom = roomOpt.get();
        if (!player.equals(gameRoom.getCurrentTurn())) throw new Exception("Not your turn");
        if (gameRoom.getBoard()[row][col] != null) throw new Exception("Cell already occupied");

        gameRoom.getBoard()[row][col] = player;

        if (checkWinner(gameRoom.getBoard(), row, col, player)) {
            gameRoom.setWinner(player);
            gameRoom.setFinished(true);
        } else {
            gameRoom.setCurrentTurn(player.equals("X") ? "O" : "X");
        }

        return gameRoomRepository.save(gameRoom);
    }

    private boolean checkWinner(String[][] board, int row, int col, String player) {
        return checkDirection(board, row, col, player, 1, 0) || // Horizontal
                checkDirection(board, row, col, player, 0, 1) || // Vertical
                checkDirection(board, row, col, player, 1, 1) || // Diagonal \
                checkDirection(board, row, col, player, 1, -1);  // Diagonal /
    }

    private boolean checkDirection(String[][] board, int row, int col, String player, int dr, int dc) {
        int count = 1;
        for (int i = 1; i < 5; i++) {
            int r = row + i * dr, c = col + i * dc;
            if (r < 0 || r >= 15 || c < 0 || c >= 15 || !player.equals(board[r][c])) break;
            count++;
        }
        for (int i = 1; i < 5; i++) {
            int r = row - i * dr, c = col - i * dc;
            if (r < 0 || r >= 15 || c < 0 || c >= 15 || !player.equals(board[r][c])) break;
            count++;
        }
        return count >= 5;
    }

    public Optional<GameRoom> getGameById(String roomId) {
        return gameRoomRepository.findByRoomId(roomId);
    }
}
