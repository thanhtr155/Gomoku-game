import gymnasium as gym
import numpy as np
from gymnasium import spaces

class GomokuEnv(gym.Env):
    def __init__(self, board_size=15):
        super(GomokuEnv, self).__init__()
        self.board_size = board_size
        self.board = np.zeros((board_size, board_size), dtype=np.int32)  # Bàn cờ 15x15
        self.current_player = 1  # Người chơi 1 bắt đầu
        self.action_space = spaces.Discrete(board_size * board_size)  # 225 nước đi có thể
        self.observation_space = spaces.Box(low=0, high=2, shape=(board_size, board_size), dtype=np.int64)

    def reset(self, seed=None, options=None):
        # Đặt lại bàn cờ
        self.board = np.zeros((self.board_size, self.board_size), dtype=np.int32)
        self.current_player = 1
        return self.board, {}

    def step(self, action):
        row = action // self.board_size
        col = action % self.board_size

        if self.board[row, col] != 0:
            return self.board, -10, True, False, {"message": "Nước đi không hợp lệ"}

        self.board[row, col] = self.current_player

        # Tính phần thưởng trung gian
        reward = 0
        # Ưu tiên trung tâm
        center = self.board_size // 2
        distance_to_center = abs(row - center) + abs(col - center)
        reward += (self.board_size - distance_to_center) * 0.5  # Tăng phần thưởng lên 0.5

        # Đánh giá tấn công/phòng thủ
        attack_score, defense_score = self._evaluate_move(row, col)
        reward += attack_score + defense_score

        if self._check_win(row, col):
            reward += 100 if self.current_player == 1 else -100
            return self.board, reward, True, False, {"message": f"Người chơi {self.current_player} thắng"}

        if np.all(self.board != 0):
            return self.board, 0, True, False, {"message": "Hòa"}

        self.current_player = 3 - self.current_player
        if self.current_player == 2:
            reward += self._opponent_move()
            # Phạt nếu không chặn được đối thủ sắp thắng
            if self._check_opponent_almost_win():
                reward -= 20  # Phạt nếu đối thủ có 4 quân liên tiếp mà AI không chặn
        return self.board, reward, False, False, {}

    def _evaluate_move(self, row, col):
        # Đánh giá nước đi: tấn công và phòng thủ
        attack_score = 0
        defense_score = 0
        player = self.current_player
        opponent = 3 - player

        for dr, dc in [(0, 1), (1, 0), (1, 1), (1, -1)]:
            # Đếm quân của AI (tấn công)
            count = 1
            for i in range(1, 5):
                r, c = row + dr * i, col + dc * i
                if 0 <= r < self.board_size and 0 <= c < self.board_size and self.board[r, c] == player:
                    count += 1
                else:
                    break
            for i in range(1, 5):
                r, c = row - dr * i, col - dc * i
                if 0 <= r < self.board_size and 0 <= c < self.board_size and self.board[r, c] == player:
                    count += 1
                else:
                    break
            if count == 4:
                attack_score += 50  # Sắp có 4 quân liên tiếp
            elif count == 3:
                attack_score += 20  # Có 3 quân liên tiếp
            elif count == 2:
                attack_score += 5  # Có 2 quân liên tiếp

            # Đếm quân của đối thủ (phòng thủ)
            count = 0
            for i in range(-4, 5):
                r, c = row + dr * i, col + dc * i
                if 0 <= r < self.board_size and 0 <= c < self.board_size and self.board[r, c] == opponent:
                    count += 1
                else:
                    count = 0
                if count == 4:
                    defense_score += 40  # Chặn được 4 quân của đối thủ
                elif count == 3:
                    defense_score += 15  # Chặn được 3 quân của đối thủ

        return attack_score, defense_score

    def _opponent_move(self):
        best_score = -float('inf')
        best_action = None
        available_moves = np.where(self.board.flatten() == 0)[0]

        # Ưu tiên chặn 4 quân liên tiếp của AI
        for action in available_moves:
            row = action // self.board_size
            col = action % self.board_size
            self.board[row, col] = self.current_player
            if self._check_opponent_almost_win(player=1):  # Kiểm tra xem nước đi này có chặn được AI không
                self.board[row, col] = 0
                best_action = action
                break
            self.board[row, col] = 0

        # Nếu không cần chặn ngay, chọn nước đi tốt nhất
        if best_action is None:
            for action in available_moves:
                row = action // self.board_size
                col = action % self.board_size
                self.board[row, col] = self.current_player
                score = self._evaluate_board()
                self.board[row, col] = 0
                if score > best_score:
                    best_score = score
                    best_action = action

        if best_action is not None:
            row = best_action // self.board_size
            col = best_action % self.board_size
            self.board[row, col] = self.current_player
            if self._check_win(row, col):
                return -100
        return 0

    def _check_opponent_almost_win(self, player=2):
        for row in range(self.board_size):
            for col in range(self.board_size):
                if self.board[row, col] != player:
                    continue
                for dr, dc in [(0, 1), (1, 0), (1, 1), (1, -1)]:
                    count = 1
                    for i in range(1, 5):
                        r, c = row + dr * i, col + dc * i
                        if 0 <= r < self.board_size and 0 <= c < self.board_size and self.board[r, c] == player:
                            count += 1
                        else:
                            break
                    for i in range(1, 5):
                        r, c = row - dr * i, col - dc * i
                        if 0 <= r < self.board_size and 0 <= c < self.board_size and self.board[r, c] == player:
                            count += 1
                        else:
                            break
                    if count == 4:
                        return True
        return False

    def _evaluate_board(self):
        # Đánh giá bàn cờ: ưu tiên chặn AI và tạo cơ hội thắng
        score = 0
        for row in range(self.board_size):
            for col in range(self.board_size):
                if self.board[row, col] == 0:
                    continue
                player = self.board[row, col]
                for dr, dc in [(0, 1), (1, 0), (1, 1), (1, -1)]:
                    count = 1
                    for i in range(1, 5):
                        r, c = row + dr * i, col + dc * i
                        if 0 <= r < self.board_size and 0 <= c < self.board_size and self.board[r, c] == player:
                            count += 1
                        else:
                            break
                    if count >= 4:
                        score += 50 if player == 2 else -50  # Ưu tiên chặn AI
                    elif count == 3:
                        score += 10 if player == 2 else -10
        return score

    def _check_win(self, row, col):
        # Kiểm tra 5 quân liên tiếp (ngang, dọc, chéo)
        player = self.board[row, col]
        directions = [(0, 1), (1, 0), (1, 1), (1, -1)]  # Ngang, dọc, chéo chính, chéo phụ
        for dr, dc in directions:
            count = 1
            # Đếm về phía trước
            for i in range(1, 5):
                r, c = row + dr * i, col + dc * i
                if 0 <= r < self.board_size and 0 <= c < self.board_size and self.board[r, c] == player:
                    count += 1
                else:
                    break
            # Đếm về phía sau
            for i in range(1, 5):
                r, c = row - dr * i, col - dc * i
                if 0 <= r < self.board_size and 0 <= c < self.board_size and self.board[r, c] == player:
                    count += 1
                else:
                    break
            if count >= 5:
                return True
        return False

    def render(self):
        # In bàn cờ (dùng để debug)
        print(self.board)