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
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center text-white p-6" style={{ backgroundImage: `url('https://img6.thuthuatphanmem.vn/uploads/2022/03/16/background-den-led-chuyen-sac_085304512.jpg')` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-blue-900/50 animate-gradient-shift"></div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold my-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 animate-text-glow">
          Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col items-center w-full max-w-md animate-fade-slide-up">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-64 px-4 py-3 text-black rounded-lg mb-4 bg-gray-200/80 shadow-lg focus:ring-4 focus:ring-blue-500/50 focus:outline-none transform hover:scale-105 transition-all duration-500 animate-bounce-in"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-64 px-4 py-3 text-black rounded-lg mb-4 bg-gray-200/80 shadow-lg focus:ring-4 focus:ring-blue-500/50 focus:outline-none transform hover:scale-105 transition-all duration-500 animate-bounce-in"
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="relative px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-110 hover:rotate-2 transition-all duration-500 group overflow-hidden"
            >
              <span className="relative z-10">Login</span>
              <span className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></span>
            </button>
          </div>
        </form>
        {error && <p className="text-red-400 mt-6 animate-text-reveal text-center">{error}</p>}
      </div>

      <style jsx>{`
        @keyframes gradient-shift { ... }
        @keyframes text-glow { ... }
        @keyframes bounce-in { ... }
        @keyframes fade-slide-up { ... }
        @keyframes text-reveal { ... }
      `}</style>
    </div>
  );
};

export default Login;