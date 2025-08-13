import React, { useState } from 'react';
import { toast } from "react-toastify";

const Users = () => {
  const [name, setname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password })
      });

      const data = await res.json();

      if (res.ok) {
        toast("User created successfully!", {
          icon: false,
          className:"bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg px-4 py-3",
          bodyClassName: "text-sm",
          progressClassName: "bg-white",
        });
        setname("");
        setUsername("");
        setPassword("");
      } else {
        toast.error(data.error || "Failed to create user", {
          className:
            "bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg px-4 py-3",
          bodyClassName: "text-sm",
          progressClassName: "bg-white",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong", {
        className:
          "bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg px-4 py-3",
        bodyClassName: "text-sm",
        progressClassName: "bg-white",
      });
    }
  };


  return (
    <div>
      

      {/* Content */}
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
  <div className="bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 shadow-xl rounded-3xl w-full max-w-4xl flex overflow-hidden text-white">
    
    {/* Left Branding Section */}
    <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-10">
      <div className="text-5xl font-bold mb-2">U</div>
      <h1 className="text-2xl font-semibold mb-4">Onboard New User</h1>
      <p className="text-center text-sm"></p>
    </div>

    {/* Right Login Form */}
    <form
      onSubmit={handleCreate}
      className="w-full md:w-1/2 bg-white/10 backdrop-blur-sm p-10 flex flex-col justify-center rounded-r-3xl"
    >
      <h3 className="text-3xl font-bold text-center text-white mb-6">Fill in User Details</h3>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-white/80">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setname(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md bg-white/20 text-gray-700 placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-white/80">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md bg-white/20 text-gray-700 placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm text-white/80">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md bg-white/20 text-gray-700 placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
        />
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition duration-200 text-sm self-center"
      >
        Create
      </button>
    </form>
  </div>
</div>
    </div>
  );
};

export default Users;