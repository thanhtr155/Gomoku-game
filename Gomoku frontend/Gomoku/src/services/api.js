import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/sign-in`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data);
    throw error.response?.data || "Login failed!";
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/sign-up`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed!";
  }
};
