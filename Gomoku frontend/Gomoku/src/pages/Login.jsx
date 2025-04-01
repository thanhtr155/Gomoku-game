import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate("/main");
    } catch (err) {
      setError(err.message || "Login failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      {/* Avatar Image */}
      <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden mb-6">
        <img
          src="https://tse1.mm.bing.net/th?id=OIP.PKlD9uuBX0m4S8cViqXZHAHaHa&pid=Api&P=0&h=220"
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <form onSubmit={handleLogin} className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
        {/* Email Input */}
        <div className="mb-4 relative">
          <span className="absolute left-3 top-3 text-gray-500">👤</span>
          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-10 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <span className="absolute left-3 top-3 text-gray-500">🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-10 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center text-gray-700 text-sm mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
        </div>

        {/* Login Button */}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Login;
