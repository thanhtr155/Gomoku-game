import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const loginUser = async (email, password) => {
  try {
    // Request a new token from the backend
    const response = await axios.post(`${API_URL}/sign-in`, { email, password });
    
    // Always return a new token
    return response.data;
  } catch (error) {
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
