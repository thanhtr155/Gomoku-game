package com.btec.gomoku_game.services;

import com.btec.gomoku_game.entities.GameRoom;
import com.btec.gomoku_game.repositories.GameRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GameRoomService {
    @Autowired
    private GameRoomRepository gameRoomRepository;


    public List<GameRoom> getAvailableRooms() {
        return gameRoomRepository.findAll().stream()
                .filter(room -> room.getPlayer2() == null && !room.isFinished())
                .collect(Collectors.toList());
    }

    public GameRoom createRoom(String roomId, String player1) {
        GameRoom gameRoom = new GameRoom(roomId, player1);
        gameRoom.setCurrentTurn("X"); // Ensure X always starts
        return gameRoomRepository.save(gameRoom);
    }


    public GameRoom makeMove(String roomId, int row, int col, String player) {
        Optional<GameRoom> roomOptional = getGameById(roomId);
        if (!roomOptional.isPresent()) {
            throw new IllegalArgumentException("Room not found");
        }

        GameRoom room = roomOptional.get();
        if (room.isFinished()) {
            throw new IllegalArgumentException("Game is already finished");
        }
        if (room.getPlayer2() == null) {
            throw new IllegalArgumentException("Waiting for second player");
        }

        String[][] board = room.getBoard();
        String expectedSymbol = player.equals(room.getPlayer1()) ? "X" : "O";
        if (!board[row][col].isEmpty() || !room.getCurrentTurn().equals(expectedSymbol)) {
            throw new IllegalArgumentException("Invalid move");
        }

        board[row][col] = room.getCurrentTurn();
        if (checkWin(board, row, col, room.getCurrentTurn())) {
            room.setFinished(true);
            room.setWinner(player);
        } else {
            room.setCurrentTurn(room.getCurrentTurn().equals("X") ? "O" : "X");
        }

        return gameRoomRepository.save(room);
    }

    private boolean checkWin(String[][] board, int row, int col, String symbol) {
        // Kiểm tra 5 quân liên tiếp theo 4 hướng: ngang, dọc, chéo chính, chéo phụ
        int[][] directions = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};
        for (int[] dir : directions) {
            int count = 1;
            for (int i = 1; i <= 4; i++) {
                int r = row + i * dir[0];
                int c = col + i * dir[1];
                if (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c].equals(symbol)) {
                    count++;
                } else {
                    break;
                }
            }
            for (int i = 1; i <= 4; i++) {
                int r = row - i * dir[0];
                int c = col - i * dir[1];
                if (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c].equals(symbol)) {
                    count++;
                } else {
                    break;
                }
            }
            if (count >= 5) return true;
        }
        return false;
    }


    public Optional<GameRoom> getGameById(String roomId) {
        return gameRoomRepository.findByRoomId(roomId);
    }

    public GameRoom joinRoom(String roomId, String player2) {
        Optional<GameRoom> roomOptional = gameRoomRepository.findByRoomId(roomId); // Giả định bạn dùng MongoDB repository
        if (roomOptional.isPresent()) {
            GameRoom gameRoom = roomOptional.get();
            gameRoom.setPlayer2(player2);
            return gameRoomRepository.save(gameRoom);
        }
        throw new RuntimeException("Room not found");
    }
}
