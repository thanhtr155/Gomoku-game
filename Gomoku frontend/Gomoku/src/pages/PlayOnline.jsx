import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const PlayOnline = () => {
  const [stompClient, setStompClient] = useState(null);
  const [gameId, setGameId] = useState(null); // Store the current game ID
  const [gameState, setGameState] = useState(null); // Store game state
  const [currentPlayer, setCurrentPlayer] = useState('X'); // Current player (X or O)
  
  useEffect(() => {
    const socket = new SockJS('/gomoku-websocket');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        
        // Subscribe to game updates
        client.subscribe('/topic/game/' + gameId, (message) => {
          const updatedGameState = JSON.parse(message.body);
          setGameState(updatedGameState);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
      }
    });

    client.activate(); // Activate the client

    setStompClient(client);

    return () => {
      client.deactivate(); // Clean up on unmount
    };
  }, [gameId]);

  const createGame = () => {
    const newGameId = 'game-' + Date.now(); // Example game ID
    setGameId(newGameId);
    
    // Notify server about new game creation
    stompClient.publish({ destination: '/app/create', body: JSON.stringify({ gameId: newGameId }) });
  };

  const makeMove = (row, col) => {
    if (stompClient && gameId) {
      stompClient.publish({ destination: '/app/move', body: JSON.stringify({ gameId, row, col, player: currentPlayer }) });
      // Switch player
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const renderBoard = () => {
    if (!gameState) return null;

    return (
      <div className="game-board">
        {gameState.board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div 
                key={colIndex} 
                className="board-cell" 
                onClick={() => makeMove(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Play Gomoku Online</h1>
      <button onClick={createGame}>Create Game</button>
      {renderBoard()}
    </div>
  );
};

export default PlayOnline;
