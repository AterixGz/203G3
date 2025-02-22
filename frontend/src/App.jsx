"use client"

import { useState } from "react"
import Login from "./Login"
import Register from "./Register"

const App = () => {
  const [currentPage, setCurrentPage] = useState("login")

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {currentPage === "login" ? (
        <>
          <Login />
          <p className="mt-6 text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => setCurrentPage("register")}
              className="text-black font-semibold hover:underline focus:outline-none transition-all duration-300"
            >
              Register here
            </button>
          </p>
        </>
      ) : (
        <>
          <Register />
          <p className="mt-6 text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => setCurrentPage("login")}
              className="text-black font-semibold hover:underline focus:outline-none transition-all duration-300"
            >
              Login here
            </button>
          </p>
        </>
      )}
    </div>
  )
}

export default App

