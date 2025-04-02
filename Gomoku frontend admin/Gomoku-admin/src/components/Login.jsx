import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Thêm react-icons

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/admin/sign-in', {
        email,
        password,
      });
      const { token, role } = response.data;
      if (role === 'admin') {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setError('');
      } else {
        setError('Access denied: Admins only');
      }
    } catch (err) {
      setError(err.response?.data || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 transform transition-all hover:scale-105 duration-300">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-tight">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <div className="flex items-center border-2 border-gray-200 rounded-lg focus-within:border-blue-500 transition-all duration-300">
              <FaEnvelope className="text-gray-400 mx-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg focus:outline-none"
                required
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <div className="flex items-center border-2 border-gray-200 rounded-lg focus-within:border-blue-500 transition-all duration-300">
              <FaLock className="text-gray-400 mx-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg focus:outline-none"
                required
                placeholder="Enter your password"
              />
            </div>
          </div>
          {error && (
            <p className="text-red-600 text-sm text-center bg-red-100 p-2 rounded-lg animate-fade-in">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-800 transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm font-medium">
          Secured Admin Access Only
        </p>
      </div>
    </div>
  );
};

export default Login;

// Thêm animation trong Tailwind config hoặc CSS
// animate-fade-in: keyframes { from { opacity: 0 } to { opacity: 1 } }