# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import numpy as np
# import json
# import logging
# import os

# app = Flask(__name__)
# CORS(app)

# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# # Load dữ liệu huấn luyện từ training_data.json
# def load_training_data():
#     try:
#         training_data_path = "training_data.json"
#         if not os.path.exists(training_data_path):
#             raise FileNotFoundError(f"Không tìm thấy file training_data.json tại: {training_data_path}")
#         with open(training_data_path, "r") as f:
#             return json.load(f)
#     except Exception as e:
#         logging.error(f"Lỗi khi load training_data.json: {str(e)}")
#         return None

# TRAINING_DATA = load_training_data()

# def check_win(board, row, col, player):
#     directions = [(0, 1), (1, 0), (1, 1), (1, -1)]
#     for dr, dc in directions:
#         count = 1
#         for i in range(1, 5):
#             r, c = row + dr * i, col + dc * i
#             if 0 <= r < 15 and 0 <= c < 15 and board[r, c] == player:
#                 count += 1
#             else:
#                 break
#         for i in range(1, 5):
#             r, c = row - dr * i, col - dc * i
#             if 0 <= r < 15 and 0 <= c < 15 and board[r, c] == player:
#                 count += 1
#             else:
#                 break
#         if count >= 5:
#             return True
#     return False

# def check_draw(board):
#     return np.all(board != 0)

# def get_ai_move(board):
#     try:
#         board_array = np.array(board, dtype=np.int32).reshape(15, 15)
#         board_flat = board_array.flatten()

#         # Nếu không load được training_data, chọn nước đi ngẫu nhiên
#         if TRAINING_DATA is None:
#             logging.warning("Không load được training_data, chọn nước đi ngẫu nhiên")
#             available_moves = np.where(board_flat == 0)[0]
#             if len(available_moves) == 0:
#                 raise Exception("Không còn nước đi hợp lệ")
#             best_action = np.random.choice(available_moves)
#         else:
#             # Tìm trạng thái tương tự trong training_data
#             best_action = None
#             best_similarity = -float('inf')
#             best_reward = -float('inf')

#             for episode in TRAINING_DATA:
#                 states = episode["states"]
#                 actions = episode["actions"]
#                 rewards = episode["rewards"]

#                 for i, state in enumerate(states):
#                     similarity = np.sum(np.array(state) == board_flat)
#                     if similarity > best_similarity:
#                         best_similarity = similarity
#                         best_action = actions[i]
#                         best_reward = rewards[i] if i < len(rewards) else 0
#                     elif similarity == best_similarity and i < len(rewards):
#                         if rewards[i] > best_reward:
#                             best_action = actions[i]
#                             best_reward = rewards[i]

#             if best_action is None:
#                 available_moves = np.where(board_flat == 0)[0]
#                 if len(available_moves) == 0:
#                     raise Exception("Không còn nước đi hợp lệ")
#                 best_action = np.random.choice(available_moves)

#         row = best_action // 15
#         col = best_action % 15

#         # Cập nhật bàn cờ với nước đi của AI (player 2)
#         board_array[row, col] = 2

#         game_status = "ongoing"
#         next_turn = "player"  # Sau khi AI đi, lượt tiếp theo là của người chơi
#         if check_win(board_array, row, col, 2):
#             game_status = "ai_wins"
#             next_turn = None  # Trò chơi kết thúc, không có lượt tiếp theo
#         elif check_draw(board_array):
#             game_status = "draw"
#             next_turn = None  # Trò chơi kết thúc, không có lượt tiếp theo

#         return {
#             "row": int(row),
#             "col": int(col),
#             "game_status": game_status,
#             "next_turn": next_turn,  # Thêm thông tin về lượt đi tiếp theo
#             "board": board_array.flatten().tolist()
#         }
#     except Exception as e:
#         logging.error(f"Lỗi xảy ra: {str(e)}")
#         return {"error": str(e)}

# @app.route('/api/ai-move', methods=['POST'])
# def ai_move():
#     try:
#         data = request.get_json()
#         board = data.get('board')

#         if not board or len(board) != 225:
#             return jsonify({"error": "Board không hợp lệ, cần 225 phần tử"}), 400

#         result = get_ai_move(board)
#         return jsonify(result)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route('/api/training-data', methods=['GET'])
# def get_training_data():
#     try:
#         if TRAINING_DATA is None:
#             return jsonify({"error": "Không tìm thấy dữ liệu huấn luyện"}), 404
#         return jsonify(TRAINING_DATA)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(host='0.0.0.0', port=5000, debug=True)