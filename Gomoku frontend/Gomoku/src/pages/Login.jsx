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
      navigate("/main"); // Điều hướng đến MainPage sau khi đăng nhập
    } catch (err) {
      setError(err.message || "Login failed!");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold my-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col w-1/3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-2 py-1 text-black rounded mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-2 py-1 text-black rounded mb-2"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 rounded">
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Login;