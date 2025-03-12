import { useState } from "react";
import { useNavigate } from "react-router-dom";

const instructions = {
  en: {
    title: "How to Play Gomoku",
    content: `
      Gomoku is a strategy board game played on a 15x15 grid. Players take turns placing their symbols 
      (X or O) on the board. The goal is to connect five in a row, column, or diagonal before your opponent.

      **Rules:**
      1. The game starts with an empty 15x15 board.
      2. X always goes first.
      3. Players alternate turns, placing one symbol per turn.
      4. The first player to align five in a row, column, or diagonal wins.
      5. Once placed, symbols cannot be moved.
    `,
  },
  vi: {
    title: "Cách chơi cờ Gomoku",
    content: `
      Cờ Gomoku là một trò chơi chiến thuật trên bàn cờ có kích thước 15x15. Người chơi lần lượt đặt 
      quân cờ của mình (X hoặc O) lên bàn cờ. Mục tiêu là kết nối năm quân cờ liên tiếp theo 
      hàng ngang, dọc hoặc chéo trước đối thủ.

      **Luật chơi:**
      1. Trò chơi bắt đầu với một bàn cờ trống 15x15.
      2. X luôn đi trước.
      3. Người chơi thay phiên nhau đặt một quân cờ trong mỗi lượt.
      4. Người đầu tiên xếp được 5 quân cờ theo hàng ngang, dọc hoặc chéo sẽ thắng.
      5. Quân cờ sau khi đặt không thể di chuyển.
    `,
  },
  es: {
    title: "Cómo Jugar Gomoku",
    content: `
      Gomoku es un juego de estrategia en un tablero de 15x15. Los jugadores colocan sus símbolos 
      (X o O) por turnos. El objetivo es conectar cinco en línea, columna o diagonal antes que el oponente.

      **Reglas:**
      1. El juego comienza con un tablero vacío de 15x15.
      2. X siempre juega primero.
      3. Los jugadores se turnan para colocar un símbolo por turno.
      4. El primer jugador que alinea cinco en una fila, columna o diagonal gana.
      5. No se pueden mover los símbolos una vez colocados.
    `,
  },
  fr: {
    title: "Comment Jouer au Gomoku",
    content: `
      Le Gomoku est un jeu de stratégie joué sur une grille 15x15. Les joueurs placent leurs symboles 
      (X ou O) à tour de rôle. L'objectif est d'aligner cinq avant l'adversaire.

      **Règles:**
      1. La partie commence avec une grille vide de 15x15.
      2. X joue toujours en premier.
      3. Les joueurs jouent à tour de rôle en plaçant un symbole.
      4. Le premier à aligner cinq en ligne, colonne ou diagonale gagne.
      5. Une fois placés, les symboles ne peuvent pas être déplacés.
    `,
  },
  de: {
    title: "Wie man Gomoku spielt",
    content: `
      Gomoku ist ein Strategiespiel auf einem 15x15-Brett. Spieler setzen abwechselnd ihre Symbole 
      (X oder O). Ziel ist es, fünf in einer Reihe, Spalte oder Diagonale zu verbinden.

      **Regeln:**
      1. Das Spiel beginnt mit einem leeren 15x15-Brett.
      2. X beginnt immer zuerst.
      3. Die Spieler setzen abwechselnd ein Symbol pro Zug.
      4. Der erste Spieler, der fünf in einer Reihe, Spalte oder Diagonale verbindet, gewinnt.
      5. Symbole können nicht entfernt oder bewegt werden.
    `,
  },
  jp: {
    title: "五目並べの遊び方",
    content: `
      五目並べは、15x15のボードで行う戦略ゲームです。プレイヤーは交互に記号（X または O）を配置します。
      目的は、相手より先に5つの記号を一列に並べることです。

      **ルール:**
      1. 15x15のボードでゲームを開始します。
      2. Xが最初に動きます。
      3. プレイヤーは交互に1つの記号を置きます。
      4. 5つの記号を縦、横、または斜めに並べたプレイヤーが勝ちます。
      5. 記号は動かしたり削除したりできません。
    `,
  },
  cn: {
    title: "如何玩五子棋",
    content: `
      五子棋是一种在15x15棋盘上进行的策略游戏。玩家轮流放置棋子（X 或 O）。
      目标是在对手之前在行、列或对角线上连成五个棋子。

      **规则:**
      1. 游戏在一个15x15的空棋盘上开始。
      2. X 总是先行。
      3. 玩家轮流放置一个棋子。
      4. 先在行、列或对角线上连成五个棋子的玩家获胜。
      5. 棋子一旦放置，不能移动或删除。
    `,
  },
};

const HowToPlay = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">{instructions[language].title}</h1>

      {/* Language Selector */}
      <select
        onChange={(e) => setLanguage(e.target.value)}
        value={language}
        className="mb-4 px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg"
      >
        <option value="en">🇬🇧 English</option>
        <option value="vi">🇻🇳 Tiếng Việt</option>
        <option value="es">🇪🇸 Español</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="de">🇩🇪 Deutsch</option>
        <option value="jp">🇯🇵 日本語</option>
        <option value="cn">🇨🇳 中文</option>
      </select>

      {/* Instructions Box */}
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="whitespace-pre-line">{instructions[language].content}</p>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
      >
        Back
      </button>
    </div>
  );
};

export default HowToPlay;
