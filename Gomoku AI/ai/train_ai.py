import json
import numpy as np
from stable_baselines3 import PPO
from gomoku_env import GomokuEnv
import logging

# Thiết lập logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Đọc lịch sử ván chơi từ file
def load_game_history():
    try:
        with open("ai/game_history.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        logging.warning("Không tìm thấy file game_history.json")
        return []

# Chuyển đổi lịch sử ván chơi thành dữ liệu huấn luyện
def process_game_history(history):
    states = []
    actions = []
    rewards = []
    for entry in history:
        if "state" in entry:
            state_str = entry["state"]
            state_flat = list(map(int, state_str.split(",")[:-1]))
            state = np.array(state_flat).reshape(15, 15)
            move = entry["move"]
            action = move["row"] * 15 + move["col"]
            states.append(state)
            actions.append(action)
        if "result" in entry:
            result = entry["result"]
            reward = 1 if result == "win" else -1 if result == "lose" else 0
            rewards.extend([reward] * len(states))  # Gán phần thưởng cho tất cả các nước đi trong ván
            break
    return states, actions, rewards

# Huấn luyện AI
def train_ai():
    env = GomokuEnv()
    try:
        model = PPO.load("gomoku_ppo.zip", env=env)
        logging.info("Đã tải mô hình hiện tại")
    except FileNotFoundError:
        model = PPO(
            "MlpPolicy",
            env,
            verbose=1,
            learning_rate=1e-4,  # Giảm learning rate để học ổn định hơn
            n_steps=4096,  # Tăng số bước để thu thập nhiều dữ liệu hơn
            batch_size=128,
            n_epochs=10,
            gamma=0.99,
            gae_lambda=0.95
        )
        logging.info("Tạo mô hình mới")

    # Đọc và xử lý lịch sử ván chơi
    history = load_game_history()
    if not history:
        logging.info("Không có lịch sử ván chơi. Huấn luyện với self-play...")
        model.learn(total_timesteps=500_000, progress_bar=True)  # Tăng lên 1 triệu bước
    else:
        states, actions, rewards = process_game_history(history)
        if states:
            logging.info(f"Huấn luyện với {len(states)} nước đi từ lịch sử ván chơi...")
            for state, action, reward in zip(states, actions, rewards):
                model.env.set_attr("board", state)
                model.learn(total_timesteps=1, reset_num_timesteps=False)
        else:
            logging.info("Không có nước đi hợp lệ trong lịch sử. Huấn luyện với self-play...")
            model.learn(total_timesteps=500_000, progress_bar=True)

    # Lưu mô hình
    model.save("ai/gomoku_ppo")
    logging.info("Đã lưu mô hình sau khi huấn luyện")

if __name__ == "__main__":
    train_ai()