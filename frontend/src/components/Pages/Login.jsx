"use client";

import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // ✅ เพิ่ม useNavigate

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ ใช้สำหรับเปลี่ยนหน้า

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://your-backend-url/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");
        navigate("/dashboard"); // ✅ เปลี่ยนหน้าไป Dashboard
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-b-2 border-gray-300 focus:border-black outline-none"
              placeholder="Username"
              required
            />
          </div>
          <div className="mb-6 relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-b-2 border-gray-300 focus:border-black outline-none"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
            Login
          </button>
        </form>

        {/* ✅ เพิ่มลิงก์ไปหน้า Register */}
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-black font-semibold hover:underline">
            Register here
          </Link>
        </p>

        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
