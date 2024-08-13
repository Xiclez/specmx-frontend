import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Navbar = ({ username }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="hamburger-icon" onClick={toggleSidebar}>☰ Dashboard</button>
        </div>
        <div className="navbar-right">
          <span className="navbar-username">{username}</span>
          <div className="user-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img src="/path-to-user-icon.png" alt="User Icon" />
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => navigate('/profile')}>Ver perfil</button>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </nav>
      {sidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
    </div>
  );
};

export default Navbar;
