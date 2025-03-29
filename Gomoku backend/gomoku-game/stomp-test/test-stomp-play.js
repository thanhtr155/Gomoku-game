const Stomp = require('@stomp/stompjs');

const client = new Stomp.Client({
    brokerURL: 'ws://localhost:8080/ws/game?roomId=room134&token=Bearer%20eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwbGF5ZXIxQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQzMjQyMzM3LCJleHAiOjE3NDMzMjg3Mzd9.IT_WoZ8nT4hy6OasYqZYzHOWU66uiIuK8yEw6-ObGQ0',
    debug: (str) => console.log(str),
    onConnect: () => {
        console.log('Connected to WebSocket!');
        client.subscribe('/topic/game/room134', (msg) => {
            console.log('Received:', msg.body);
            const data = JSON.parse(msg.body);
            if (data.message) {
                console.error('Error:', data.message);
            } else {
                console.log('Current turn:', data.currentTurn);
                if (data.finished) {
                    console.log('Game finished! Winner:', data.winner);
                }
            }
        });
        client.publish({
            destination: '/app/game/state',
            body: JSON.stringify({ roomId: 'room134' })
        });

        // Các nước đi để tạo điều kiện thắng cho Player 1
        const moves = [
            { row: 1, col: 1, player: 'player1@example.com' }, // Player 1 (X)
            { row: 2, col: 1, player: 'player6@example.com' }, // Player 2 (O)
            { row: 1, col: 2, player: 'player1@example.com' }, // Player 1 (X)
            { row: 2, col: 2, player: 'player6@example.com' }, // Player 2 (O)
            { row: 1, col: 3, player: 'player1@example.com' }, // Player 1 (X)
            { row: 2, col: 3, player: 'player6@example.com' }, // Player 2 (O)
            { row: 1, col: 4, player: 'player1@example.com' }, // Player 1 (X)
            { row: 2, col: 4, player: 'player6@example.com' }, // Player 2 (O)
            { row: 1, col: 5, player: 'player1@example.com' }  // Player 1 (X) - Thắng
        ];

        let index = 0; // Bắt đầu từ nước đi đầu tiên
        let gameFinished = false;

        const sendMove = () => {
            if (index < moves.length && !gameFinished) {
                const move = moves[index];
                const playerLabel = move.player === 'player1@example.com' ? 'Player 1 (X)' : 'Player 2 (O)';
                console.log(`Sending move: ${playerLabel} places at [${move.row},${move.col}]`);
                client.publish({
                    destination: '/app/game/move',
                    body: JSON.stringify({
                        roomId: 'room134',
                        row: move.row,
                        col: move.col,
                        player: move.player
                    })
                });
                index++;
                setTimeout(() => {
                    if (!gameFinished) {
                        sendMove();
                    }
                }, 1000); // Gửi nước đi tiếp theo sau 1 giây
            }
        };

        client.onStompMessage = (msg) => {
            const data = JSON.parse(msg.body);
            if (data.finished) {
                gameFinished = true;
            }
        };

        setTimeout(sendMove, 2000);
    },
    onStompError: (error) => {
        console.error('STOMP Error:', error);
    },
    onWebSocketError: (error) => {
        console.error('WebSocket Error:', error);
    }
});

client.activate();