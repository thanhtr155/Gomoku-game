package com.btec.quanlykhohang_api.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "moves")
public class Move {
    @Id
    private String id;
    private String gameId;
    private int row;
    private int col;
    private String player;
    private String userEmail; // ✅ Store who made the move
    private Date timestamp; // ✅ Store when the move was made

    public Move() {
        this.timestamp = new Date();
    }

    public Move(String gameId, int row, int col, String player, String userEmail) {
        this.gameId = gameId;
        this.row = row;
        this.col = col;
        this.player = player;
        this.userEmail = userEmail;
        this.timestamp = new Date();
    }

    // Getters & Setters
    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
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

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Date getTimestamp() {
        return timestamp;
    }
}
