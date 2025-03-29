const Stomp = require('@stomp/stompjs');

// Client cho Player 1 (gửi tin nhắn)
const client1 = new Stomp.Client({
    brokerURL: 'ws://localhost:8080/ws/game?roomId=room134&token=Bearer%20eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwbGF5ZXIxQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQzMjQyMzM3LCJleHAiOjE3NDMzMjg3Mzd9.IT_WoZ8nT4hy6OasYqZYzHOWU66uiIuK8yEw6-ObGQ0',
    debug: (str) => console.log('Player 1:', str),
    onConnect: () => {
        console.log('Player 1: Connected to WebSocket!');
        client1.subscribe('/topic/game/room134', (msg) => {
            console.log('Player 1 Received:', msg.body);
        });
        setTimeout(() => {
            console.log('Player 1: Sending chat message');
            client1.publish({
                destination: '/app/game/chat',
                body: JSON.stringify({
                    roomId: 'room134',
                    sender: 'player1@example.com',
                    content: 'Hello Player 2!'
                })
            });
        }, 2000);
    },
    onStompError: (error) => {
        console.error('Player 1 STOMP Error:', error);
    },
    onWebSocketError: (error) => {
        console.error('Player 1 WebSocket Error:', error);
    }
});

// Client cho Player 2 (nhận tin nhắn)
const client2 = new Stomp.Client({
    brokerURL: 'ws://localhost:8080/ws/game?roomId=room134&token=Bearer%20eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwbGF5ZXI2QGV4YW1wbGUuY29tIiwiaWF0IjoxNzQzMjUwODk2LCJleHAiOjE3NDMzMzcyOTZ9.-_60OsuZvj2vV6nmoQPje7Q6TFvR66nNltycA2mabD0',
    debug: (str) => console.log('Player 2:', str),
    onConnect: () => {
        console.log('Player 2: Connected to WebSocket!');
        client2.subscribe('/topic/game/room134', (msg) => {
            console.log('Player 2 Received:', msg.body);
        });
    },
    onStompError: (error) => {
        console.error('Player 2 STOMP Error:', error);
    },
    onWebSocketError: (error) => {
        console.error('Player 2 WebSocket Error:', error);
    }
});

client1.activate();
client2.activate();