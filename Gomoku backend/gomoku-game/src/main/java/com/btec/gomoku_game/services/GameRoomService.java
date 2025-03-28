package com.btec.gomoku_game.services;

import com.btec.gomoku_game.entities.GameHistory;
import com.btec.gomoku_game.entities.GameRoom;
import com.btec.gomoku_game.repositories.GameHistoryRepository;
import com.btec.gomoku_game.repositories.GameRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GameRoomService {
    @Autowired
    private GameRoomRepository gameRoomRepository;
    @Autowired
    private GameHistoryRepository gameHistoryRepository;

    public GameRoom createRoom(String roomId, String player1) {
        GameRoom gameRoom = new GameRoom(roomId, player1);
        gameRoom.setCurrentTurn("X");
        GameHistory history = new GameHistory(roomId, player1, null); // Lưu lịch sử khi tạo phòng
        gameHistoryRepository.save(history);
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
        if (!player.equals(room.getPlayer1()) && !player.equals(room.getPlayer2())) {
            throw new IllegalArgumentException("Player not in this room");
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
            // Cập nhật lịch sử khi có người thắng
            Optional<GameHistory> historyOpt = gameHistoryRepository.findById(roomId);
            if (historyOpt.isPresent()) {
                GameHistory history = historyOpt.get();
                history.setWinner(player);
                history.setEndTime(System.currentTimeMillis());
                gameHistoryRepository.save(history);
            }
        } else {
            room.setCurrentTurn(room.getCurrentTurn().equals("X") ? "O" : "X");
        }

        return gameRoomRepository.save(room);
    }

    // Các phương thức khác giữ nguyên
    private boolean checkWin(String[][] board, int row, int col, String symbol) {
        // Logic giữ nguyên
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
        Optional<GameRoom> roomOptional = gameRoomRepository.findByRoomId(roomId);
        if (roomOptional.isPresent()) {
            GameRoom gameRoom = roomOptional.get();
            if (gameRoom.getPlayer2() != null) {
                throw new IllegalArgumentException("Room is full");
            }
            if (gameRoom.getPlayer1().equals(player2)) {
                throw new IllegalArgumentException("Cannot join as the same player");
            }
            gameRoom.setPlayer2(player2);
            // Cập nhật lịch sử khi player2 tham gia
            Optional<GameHistory> historyOpt = gameHistoryRepository.findById(roomId);
            if (historyOpt.isPresent()) {
                GameHistory history = historyOpt.get();
                history.setPlayer2(player2);
                gameHistoryRepository.save(history);
            }
            return gameRoomRepository.save(gameRoom);
        }
        throw new RuntimeException("Room not found");
    }
}