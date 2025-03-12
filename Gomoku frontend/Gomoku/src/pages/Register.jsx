import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api"; // Import API function

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDay: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await registerUser(user);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err || "Registration failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleRegister} className="flex flex-col items-center">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={user.firstName}
          onChange={handleChange}
          className="px-4 py-2 mb-4 text-black rounded-lg w-64"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={user.lastName}
          onChange={handleChange}
          className="px-4 py-2 mb-4 text-black rounded-lg w-64"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          className="px-4 py-2 mb-4 text-black rounded-lg w-64"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          className="px-4 py-2 mb-4 text-black rounded-lg w-64"
        />
        <input
          type="date"
          name="birthDay"
          value={user.birthDay}
          onChange={handleChange}
          className="px-4 py-2 mb-4 text-black rounded-lg w-64"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={user.address}
          onChange={handleChange}
          className="px-4 py-2 mb-4 text-black rounded-lg w-64"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 mb-4"
        >
          Register
        </button>
      </form>

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
