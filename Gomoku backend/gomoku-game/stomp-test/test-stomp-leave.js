const Stomp = require('@stomp/stompjs');

// Client cho Player 1 (rời phòng)
const client1 = new Stomp.Client({
    brokerURL: 'ws://localhost:8080/ws/game?roomId=room135&token=Bearer%20eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwbGF5ZXIxQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQzMjU3NDczLCJleHAiOjE3NDMzNDM4NzN9.ljLQMIAjtl6AgWeRhxMFPNYnLyVwChklk_ZbLdkDrUw',
    debug: (str) => console.log('Player 1:', str),
    onConnect: () => {
        console.log('Player 1: Connected to WebSocket!');
        client1.subscribe('/topic/game/room135', (msg) => {
            console.log('Player 1 Received:', msg.body);
        });
        client1.publish({
            destination: '/app/game/state',
            body: JSON.stringify({ roomId: 'room135' })
        });
        setTimeout(() => {
            console.log('Player 1: Leaving room');
            client1.publish({
                destination: '/app/game/leave',
                body: JSON.stringify({
                    roomId: 'room135',
                    playerEmail: 'player1@example.com'
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

// Client cho Player 2 (nhận cập nhật trạng thái phòng và rời sau đó)
const client2 = new Stomp.Client({
    brokerURL: 'ws://localhost:8080/ws/game?roomId=room135&token=Bearer%20eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwbGF5ZXI2QGV4YW1wbGUuY29tIiwiaWF0IjoxNzQzMjU3NDk0LCJleHAiOjE3NDMzNDM4OTR9.TDw515Df6djQxUzC5bRabuWQsZmnp1qvsxxsbo0gpi8',
    debug: (str) => console.log('Player 2:', str),
    onConnect: () => {
        console.log('Player 2: Connected to WebSocket!');
        client2.subscribe('/topic/game/room135', (msg) => {
            console.log('Player 2 Received:', msg.body);
            const data = JSON.parse(msg.body);
            // Nếu Player 1 đã rời (player1: null), Player 2 cũng rời
            if (data.player1 === null) {
                setTimeout(() => {
                    console.log('Player 2: Leaving room');
                    client2.publish({
                        destination: '/app/game/leave',
                        body: JSON.stringify({
                            roomId: 'room135',
                            playerEmail: 'player6@example.com'
                        })
                    });
                }, 2000);
            }
        });
        client2.publish({
            destination: '/app/game/state',
            body: JSON.stringify({ roomId: 'room135' })
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