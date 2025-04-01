import React from "react";

const GameHistoryTab = ({ gameHistory }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Game History</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Room ID</th>
            <th className="border p-2">Player 1</th>
            <th className="border p-2">Player 2</th>
            <th className="border p-2">Winner</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">End Time</th>
          </tr>
        </thead>
        <tbody>
          {gameHistory.map((game) => (
            <tr key={game.id}>
              <td className="border p-2">{game.roomId}</td>
              <td className="border p-2">{game.player1}</td>
              <td className="border p-2">{game.player2 || "N/A"}</td>
              <td className="border p-2">{game.winner || "Draw"}</td>
              <td className="border p-2">{new Date(game.startTime).toLocaleString()}</td>
              <td className="border p-2">{game.endTime ? new Date(game.endTime).toLocaleString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameHistoryTab;