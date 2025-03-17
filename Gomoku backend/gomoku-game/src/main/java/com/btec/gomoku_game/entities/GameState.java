package com.btec.gomoku_game.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;
import java.util.Date;

@Document(collection = "games")
public class GameState {
    @Id
    private String id;
    private String[][] board;
    private String currentPlayer;
    private String status;
    private Date createdAt;

    private static final int BOARD_SIZE = 15;
    private static final int WIN_COUNT = 5;

    public GameState() {
        this.board = new String[BOARD_SIZE][BOARD_SIZE];
        for (String[] row : board) {
            Arrays.fill(row, "");
        }
        this.currentPlayer = "X";
        this.status = "IN_PROGRESS";
        this.createdAt = new Date();
    }

    public boolean makeMove(int row, int col, String player) {
        if (!status.equals("IN_PROGRESS") || !board[row][col].isEmpty()) {
            return false;
        }
        board[row][col] = player;
        if (checkWin(row, col, player)) {
            status = player + "_WINS";
        } else if (isBoardFull()) {
            status = "DRAW";
        } else {
            currentPlayer = currentPlayer.equals("X") ? "O" : "X";
        }
        return true;
    }

    private boolean checkWin(int row, int col, String player) {
        return checkDirection(row, col, player, 1, 0) ||
                checkDirection(row, col, player, 0, 1) ||
                checkDirection(row, col, player, 1, 1) ||
                checkDirection(row, col, player, 1, -1);
    }

    private boolean checkDirection(int row, int col, String player, int dRow, int dCol) {
        int count = 1;
        for (int i = 1; i < WIN_COUNT; i++) {
            int r = row + dRow * i, c = col + dCol * i;
            if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || !board[r][c].equals(player)) break;
            count++;
        }
        for (int i = 1; i < WIN_COUNT; i++) {
            int r = row - dRow * i, c = col - dCol * i;
            if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || !board[r][c].equals(player)) break;
            count++;
        }
        return count >= WIN_COUNT;
    }

    private boolean isBoardFull() {
        for (String[] row : board) {
            for (String cell : row) {
                if (cell.isEmpty()) return false;
            }
        }
        return true;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCurrentPlayer() {
        return currentPlayer;
    }

    public String getStatus() {
        return status;
    }

    public String[][] getBoard() {
        return board;
    }

    public Date getCreatedAt() {
        return createdAt;
    }
}
