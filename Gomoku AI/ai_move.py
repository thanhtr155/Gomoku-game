import sys
import tensorflow as tf
import numpy as np

BOARD_SIZE = 15

def deserialize_board(board_str):
    board = [["" for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
    cells = board_str.split(",")[:-1]  # Bỏ dấu phẩy cuối
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            cell = cells[i * BOARD_SIZE + j].strip()
            board[i][j] = cell if cell in ["X", "O"] else ""
    return board

def state_to_vector(board):
    vector = np.zeros(BOARD_SIZE * BOARD_SIZE)
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if board[i][j] == "X":
                vector[i * BOARD_SIZE + j] = 1
            elif board[i][j] == "O":
                vector[i * BOARD_SIZE + j] = -1
    return vector

model = tf.keras.models.load_model("gomoku_dqn.h5")

board_str = sys.argv[1]
board = deserialize_board(board_str)
state = state_to_vector(board)
q_values = model.predict(state.reshape(1, -1))[0]

for i in range(BOARD_SIZE * BOARD_SIZE):
    row, col = divmod(i, BOARD_SIZE)
    if board[row][col] == "":
        print(f"{row},{col}")
        break