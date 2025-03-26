package com.btec.gomoku_game.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;

import java.util.Date;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class JwtUtil {

    private static final String SECRET_KEY = "Akjhsdfjkhsdfhsadhjaskdhasjkhdkjsahdjkashdjkashdjksahdjksadhsakjh"; // Use a secure key
    private static final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds

    /**
     * Generate a JWT token for a given email.
     *
     * @param email The user's email.
     * @return The JWT token.
     */
    public static String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public static boolean verifyToken(String token) throws Exception {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            throw new Exception("Invalid JWT signature");
        } catch (ExpiredJwtException e) {
            throw new Exception("JWT token is expired");
        } catch (Exception e) {
            throw new Exception("Invalid JWT token");
        }
    }



    // Existing methods for validation and claims extraction
}
