import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


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
      sessionStorage.setItem("token", data.token);
      navigate("/main");
    } catch (err) {
      setError(err || "Invalid login credentials.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen 
      bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR25bDS4x2rtvhcUOa2QWl4RuscZBg1TFGvuQ&s')] 
      bg-cover bg-center bg-no-repeat"
    >
      <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg w-96 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <span className="text-gray-700 text-4xl">👤</span>
          </div>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col">
          <div className="relative mb-4">
            <span className="absolute left-3 top-3 text-gray-500">👤</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg bg-white text-gray-900 focus:outline-none"
            />
          </div>
          <div className="relative mb-4">
            <span className="absolute left-3 top-3 text-gray-500">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg bg-white text-gray-900 focus:outline-none"
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center text-white">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <button className="text-white text-sm hover:underline">
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 mb-4"
          >
            LOGIN
          </button>
          <p className="text-white">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-400 hover:underline"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
