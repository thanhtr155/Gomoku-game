package com.btec.gomoku_game.configs;

import com.btec.gomoku_game.security.JwtUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/gomoku-websocket")
                .setAllowedOrigins("http://localhost:3000")
                .addInterceptors(new JwtHandshakeInterceptor()) // ✅ Attach JWT validation
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
    }


    /**
     * Interceptor to extract JWT token from WebSocket connection.
     */
    private static class JwtHandshakeInterceptor implements HandshakeInterceptor {
        @Override
        public boolean beforeHandshake(
                org.springframework.http.server.ServerHttpRequest request,
                org.springframework.http.server.ServerHttpResponse response,
                org.springframework.web.socket.WebSocketHandler wsHandler,
                Map<String, Object> attributes) {

            String query = request.getURI().getQuery();
            if (query != null && query.startsWith("token=")) {
                String token = query.split("=")[1];

                try {
                    if (JwtUtil.verifyToken(token)) {
                        attributes.put("jwt", token);
                        return true;
                    }
                } catch (Exception e) {
                    System.out.println("JWT validation failed: " + e.getMessage());
                }
            }

            return false;
        }

        @Override
        public void afterHandshake(
                org.springframework.http.server.ServerHttpRequest request,
                org.springframework.http.server.ServerHttpResponse response,
                org.springframework.web.socket.WebSocketHandler wsHandler,
                Exception exception) {
        }
    }
}
