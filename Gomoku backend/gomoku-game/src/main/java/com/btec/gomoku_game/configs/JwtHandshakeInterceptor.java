package com.btec.gomoku_game.configs;

import com.btec.gomoku_game.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(JwtHandshakeInterceptor.class);

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            String token = servletRequest.getServletRequest().getHeader("Authorization");
            String sessionId = servletRequest.getServletRequest().getSession().getId();
            String roomId = servletRequest.getServletRequest().getParameter("roomId");

            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7); // Loại bỏ "Bearer "
                try {
                    if (JwtUtil.verifyToken(token)) {
                        String email = JwtUtil.getEmailFromToken(token);
                        if (email != null && roomId != null) {
                            attributes.put("sessionId", sessionId);
                            attributes.put("roomId", roomId);
                            attributes.put("email", email); // Lưu email vào attributes để WebSocketHandler sử dụng
                            logger.info("JWT verified for email: {} in room: {}", email, roomId);
                            return true;
                        }
                    }
                } catch (Exception e) {
                    logger.warn("JWT verification failed: {}", e.getMessage());
                }
            } else {
                logger.warn("No valid Authorization header found");
            }
            response.setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
            return false;
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // Không cần xử lý sau handshake
    }
}