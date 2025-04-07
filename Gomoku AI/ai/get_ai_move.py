import json
import numpy as np
from stable_baselines3 import PPO
import sys

def get_ai_move(board):
    try:
        model = PPO.load("gomoku_ppo.zip")
        board_array = np.array(board, dtype=np.int32).reshape(15, 15)
        action, _ = model.predict(board_array)
        row = action // 15
        col = action % 15
        return {"row": int(row), "col": int(col)}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        board_input = sys.stdin.readline().strip()
        board = [int(x) for x in board_input.split(",") if x.strip()]
        if len(board) != 225:
            raise ValueError(f"Invalid board size: expected 225 elements, got {len(board)}")
        result = get_ai_move(board)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))