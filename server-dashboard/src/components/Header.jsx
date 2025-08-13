import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, LogOut, Menu } from 'lucide-react';
import { toast } from "react-toastify";

const Header = ({ onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { server_ip } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHistoryPage = location.pathname.startsWith('/history');
  const isLoginPage = location.pathname === '/login';
  const isDashboardPage = location.pathname === '/';
  const isUsersPage = location.pathname.startsWith('/users');
  const isUsersListPage = location.pathname.startsWith('/users-list');

  if (isLoginPage) return null;

  const server = location.state?.server;
  const getServerName = () => server?.server_ip || decodeURIComponent(server_ip || '');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast("Logout successful!");
    navigate('/login');
  };

  return (
    <div className="bg-dashboardBg shadow-md py-4 px-6 flex justify-between items-center text-xl font-bold relative">
      {/* Left side: Menu + Title / Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Hamburger Menu - Only on Dashboard */}
        {isDashboardPage && (
          <div className="relative flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center text-white hover:text-red-500 transition h-8"
            >
              <Menu size={28} />
            </button>
            {menuOpen && (
              <div className="absolute left-0 top-full mt-1 bg-dashboardBg shadow-lg rounded-md overflow-hidden z-10">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/users');
                  }}
                  className="block w-full text-left px-4 py-2 text-white hover:text-red-500"
                >
                  Users
                </button>
               <button
  onClick={() => {
    setMenuOpen(false);
    navigate('/users-list');
  }}
  className="whitespace-nowrap block w-full text-left px-4 py-2 text-white hover:text-red-500"
>
  Users List
</button>
              </div>
            )}
          </div>
        )}

        {/* Back buttons */}
        {(isHistoryPage || isUsersPage || isUsersListPage) && (
          <button
            onClick={() => navigate('/')}
            className="text-white hover:text-red-500 transition-transform hover:-translate-x-1"
          >
            <ArrowLeft size={24} />
          </button>
        )}

        {/* Titles / Breadcrumbs */}
        {isDashboardPage && (
          <span className="text-white font-extrabold text-2xl">Server Dashboard</span>
        )}

        {isHistoryPage && (
          <div className="flex items-center gap-2">
            <span
              className="text-white font-bold text-xl cursor-pointer hover:text-red-500"
              onClick={() => navigate('/')}
            >
              Server Dashboard
            </span>
            <span className="text-white">/</span>
            <span className="text-red-500 font-semibold text-xl">History</span>
            <span className="text-white font-semibold text-xl">{getServerName()}</span>
          </div>
        )}

        {isUsersPage && !isUsersListPage && (
          <div className="flex items-center gap-2">
            <span
              className="text-white font-bold text-xl cursor-pointer hover:text-red-500"
              onClick={() => navigate('/')}
            >
              Server Dashboard
            </span>
            <span className="text-white">/</span>
            <span className="text-red-500 font-semibold text-xl">Users</span>
          </div>
        )}

        {isUsersListPage && (
          <div className="flex items-center gap-2">
            <span
              className="text-white font-bold text-xl cursor-pointer hover:text-red-500"
              onClick={() => navigate('/')}
            >
              Server Dashboard
            </span>
            <span className="text-white">/</span>
            <span className="text-red-500 font-semibold text-xl">Users List</span>
          </div>
        )}
      </div>

      {/* Right side: Search + Logout (only on dashboard) */}
      {isDashboardPage && (
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search server"
            className="w-48 input-sm bg-dashboardBg text-white placeholder-gray-400 border-0 border-b-2 border-gray-500 focus:border-pink-500 focus:outline-none"
            onChange={(e) => onSearch(e.target.value)}
          />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
          >
            <LogOut size={20} />
            <span className="text-base font-semibold">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;