import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  
  const fetchUsers = async () => {
    try {
      
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 
  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", 
      cancelButtonColor: "#6b7280", 
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        toast("User deleted successfully!");
        setUsers(users.filter((user) => user.id !== id));
      } else {
        toast.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  if (users.length === 0) {
    return <p className="text-white text-center mt-10">No users found.</p>;
  }

  return (
    <div className="p-4 min-h-screen bg-dashboardBg text-white">
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Created Users</h2>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 text-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-black/20 text-left">
              <th className="py-3 px-4">id</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={user.id}
                className="border-t border-white/20 hover:bg-white/10 transition"
              >
                <td className="py-2 px-4">{idx + 1}</td>
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} className="text-white" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default UsersList;