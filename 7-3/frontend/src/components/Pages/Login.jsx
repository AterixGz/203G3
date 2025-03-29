
"use client";

import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Handles the form submission for user login.
 * Prevents the default form action, and attempts to log the user in by sending
 * a POST request to the server with the provided username and password.
 * If the login is successful, stores the JWT token, updates the message state,
 * navigates to the dashboard, and saves the token in localStorage.
 * If the login fails, sets an appropriate error message.
 * Catches any errors that occur during the fetch operation and sets an error message.
 *
 * @param {Event} e - The form submission event.
 */

/******  4cfaac5f-3ac3-4d1f-b8bc-37b394c836fb  *******/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token); // Store the JWT token
        setMessage("Login successful!");
        navigate("/dashboard");
        localStorage.setItem("token", data.token); // Save token in localStorage (or sessionStorage)
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setMessage("Logged out successfully.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
        {!token ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-b-2 border-gray-300 focus:border-black outline-none transition-all duration-300"
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
                className="pl-10 pr-4 py-2 w-full border-b-2 border-gray-300 focus:border-black outline-none transition-all duration-300"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-white hover:text-black hover:shadow-[5px_5px_15px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition-all duration-300">              
              <b>Login</b>
            </button>
          </form>
        ) : (
          <div>
            <p className="text-center text-sm text-green-600">{message}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        )}
        {/* ✅ เพิ่มลิงก์ไปหน้า Register */}
        <p className="mt-4 text-center !text-[15px] !text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-black font-semibold hover:underline">
            Sign up
          </Link>
        </p>
        {message && !token && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default Login; 