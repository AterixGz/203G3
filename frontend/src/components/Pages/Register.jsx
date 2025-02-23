"use client";

import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // ✅ เพิ่ม useNavigate

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ ใช้สำหรับเปลี่ยนหน้า

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://your-backend-url/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        navigate("/"); // ✅ เปลี่ยนไปหน้า Login
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              className="pl-10 pr-4 py-2 w-full border-b-2 border-gray-300 focus:border-black outline-none"
              required
            />
          </div>
          <div className="mb-6 relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="pl-10 pr-4 py-2 w-full border-b-2 border-gray-300 focus:border-black outline-none"
              required
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
            Register
          </button>
        </form>

        {/* ✅ เพิ่มลิงก์ไปหน้า Login */}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
