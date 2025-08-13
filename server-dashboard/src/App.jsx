import React, { useState } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import Users from './pages/Users';
import Header from './components/Header';
import UsersList from './pages/UsersList';


function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Layout onSearch={setSearchTerm}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={isLoggedIn ? <Dashboard searchTerm={searchTerm} /> : <Navigate to="/login" />} />
          <Route path="/users" element={isLoggedIn ? <Users /> : <Navigate to="/login" />} />
          <Route path="/users-list" element={isLoggedIn ? <UsersList /> : <Navigate to="/login" />} />
          <Route path="/history/:server_ip" element={isLoggedIn ? <History /> : <Navigate to="/login" />} />
          
        </Routes>
      </Layout>
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </Router>
  );
}

const Layout = ({ children, onSearch }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header onSearch={onSearch} />}
      {children}
    </>
  );
};

export default App;