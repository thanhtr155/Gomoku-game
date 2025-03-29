package com.btec.gomoku_game.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "game_rooms")
public class GameRoom {
    @Id
    private String id;
    private String roomId;
    private String player1;
    private String player2;
    private String[][] board;
    private String currentTurn;
    private String winner;
    private boolean finished;

    public GameRoom() {
        this.board = new String[15][15];
        for (int i = 0; i < 15; i++) {
            for (int j = 0; j < 15; j++) {
                this.board[i][j] = "";
            }
        }
    }

    public GameRoom(String roomId, String player1) {
        this();
        this.roomId = roomId;
        this.player1 = player1;
        this.currentTurn = "X";
        this.finished = false;
    }

    // Getters và setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getPlayer1() { return player1; }
    public void setPlayer1(String player1) { this.player1 = player1; }
    public String getPlayer2() { return player2; }
    public void setPlayer2(String player2) { this.player2 = player2; }
    public String[][] getBoard() { return board; }
    public void setBoard(String[][] board) { this.board = board; }
    public String getCurrentTurn() { return currentTurn; }
    public void setCurrentTurn(String currentTurn) { this.currentTurn = currentTurn; }
    public String getWinner() { return winner; }
    public void setWinner(String winner) { this.winner = winner; }
    public boolean isFinished() { return finished; }
    public void setFinished(boolean finished) { this.finished = finished; }
}