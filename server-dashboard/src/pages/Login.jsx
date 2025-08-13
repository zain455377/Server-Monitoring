import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast(" Login successful!", {
          icon: false,
          className:
            "bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg px-4 py-3",
          bodyClassName: "text-sm",
          progressClassName: "bg-white",
        });
        onLogin();
        navigate("/");
      } else {
        toast.error(data.error || "❌ Login failed!", {
          className:
            "bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg shadow-lg px-4 py-3",
          bodyClassName: "text-sm",
          progressClassName: "bg-white",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Something went wrong", {
        className:
          "bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg px-4 py-3",
        bodyClassName: "text-sm",
        progressClassName: "bg-white",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl w-full max-w-4xl flex overflow-hidden border border-white/20">
        {/* Left Branding Section */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-10 text-white">
          <div className="text-6xl font-extrabold mb-2 tracking-wide">S</div>
          <h1 className="text-3xl font-semibold mb-4">Server</h1>
          <p className="text-center text-sm opacity-80">
            Sign in to your dashboard to continue
          </p>
        </div>

        {/* Right Login Form */}
        <form
          onSubmit={handleLogin}
          className="w-full md:w-1/2 bg-white/10 backdrop-blur-md p-10 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-center text-white mb-8">
            Welcome Back
          </h2>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-bold text-white">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-sm font-bold text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-full hover:scale-105 hover:shadow-lg transition duration-300 mx-auto"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;