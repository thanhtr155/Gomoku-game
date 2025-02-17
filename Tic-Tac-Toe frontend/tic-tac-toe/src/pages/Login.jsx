import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Simulate login logic (Replace with real auth later)
    if (email && password) {
      navigate("/play"); // Redirect to Tic-Tac-Toe game
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 mb-4 text-black rounded-lg w-64"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-2 mb-4 text-black rounded-lg w-64"
      />
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 mb-4"
      >
        Login
      </button>
      <p>
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/register")}
          className="text-blue-400 hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;