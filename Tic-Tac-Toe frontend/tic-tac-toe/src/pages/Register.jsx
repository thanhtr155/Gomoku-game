import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // Simulate registration logic (Replace with real backend later)
    if (name && email && password) {
      navigate("/login"); // Redirect to Login page after registration
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-4 py-2 mb-4 text-black rounded-lg w-64"
      />
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
        onClick={handleRegister}
        className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 mb-4"
      >
        Register
      </button>
      <p>
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-blue-400 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;