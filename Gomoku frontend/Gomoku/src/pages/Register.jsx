import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api"; // Import API function

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
    <div 
      className="flex flex-col items-center justify-center min-h-screen text-white p-6"
      style={{
        backgroundImage: "url('data:image/jpeg;base64,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')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg w-80">
        <div className="flex justify-center mb-4">
          <img src="data:image/jpeg;base64,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" alt="Avatar" className="w-20 h-20 rounded-full border-2 border-white" />
        </div>
        <h1 className="text-2xl font-semibold text-center mb-4">Register</h1>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

        <form onSubmit={handleRegister} className="flex flex-col items-center">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={user.firstName}
            onChange={handleChange}
            className="px-4 py-2 mb-3 w-full text-black rounded-md bg-white bg-opacity-80 focus:outline-none"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={user.lastName}
            onChange={handleChange}
            className="px-4 py-2 mb-3 w-full text-black rounded-md bg-white bg-opacity-80 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            className="px-4 py-2 mb-3 w-full text-black rounded-md bg-white bg-opacity-80 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="px-4 py-2 mb-3 w-full text-black rounded-md bg-white bg-opacity-80 focus:outline-none"
          />
          <input
            type="date"
            name="birthDay"
            value={user.birthDay}
            onChange={handleChange}
            className="px-4 py-2 mb-3 w-full text-black rounded-md bg-white bg-opacity-80 focus:outline-none"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={user.address}
            onChange={handleChange}
            className="px-4 py-2 mb-3 w-full text-black rounded-md bg-white bg-opacity-80 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md w-full hover:bg-blue-700 transition mb-3"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center">
          Already have an account? {" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-300 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
