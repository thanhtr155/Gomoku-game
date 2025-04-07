from stable_baselines3 import PPO
from gomoku_env import GomokuEnv

# Tạo môi trường Gomoku
env = GomokuEnv()

# Tạo mô hình PPO mới
model = PPO("MlpPolicy", env, verbose=1)

# Huấn luyện mô hình với self-play
print("Training PPO model...")
model.learn(total_timesteps=50000)  # Huấn luyện 50,000 bước

# Lưu mô hình
model.save("ai/gomoku_ppo")
print("PPO model saved to ai/gomoku_ppo.zip")