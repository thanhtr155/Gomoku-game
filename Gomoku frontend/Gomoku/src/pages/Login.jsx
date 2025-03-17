import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Ensure the token is cleared every time the app starts
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const data = await loginUser(email, password);
      sessionStorage.setItem("token", data.token); // Store new token
      navigate("/main"); // Redirect after login
    } catch (err) {
      setError(err || "Invalid login credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleLogin} className="flex flex-col items-center">
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
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 mb-4"
        >
          Login
        </button>
      </form>

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
