package com.btec.gomoku_game.entities;

public class GameMove {
    private String roomId;
    private int row;
    private int col;
    private String player;

    public GameMove() {}

    public GameMove(String roomId, int row, int col, String player) {
        this.roomId = roomId;
        this.row = row;
        this.col = col;
        this.player = player;
    }

    // Getters and Setters
    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getCol() {
        return col;
    }

    public void setCol(int col) {
        this.col = col;
    }

    public String getPlayer() {
        return player;
    }

    public void setPlayer(String player) {
        this.player = player;
    }
}
