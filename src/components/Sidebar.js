import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css'; // Estilos específicos para el sidebar

const Sidebar = ({ isOpen, toggleSidebar, username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    navigate('/login');
    toggleSidebar(); // Cierra el sidebar al hacer logout
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar__logo">
        <img src="logo.png" alt="Logo" />
      </div>
      <ul className="sidebar-nav">
        <li><Link to="/home" onClick={toggleSidebar}><i className="icon-dashboard"></i>Home</Link></li>
        <li><Link to="/blog" onClick={toggleSidebar}><i className="icon-admin"></i>Blog</Link></li>
        <li><Link to="/clients" onClick={toggleSidebar}><i className="icon-data-master"></i>Clientes</Link></li>
        <li><Link to="/orders" onClick={toggleSidebar}><i className="icon-transaksi"></i>Ordenes</Link></li>
        <li><Link to="/reports" onClick={toggleSidebar}><i className="icon-laporan"></i>Reportes</Link></li>
      </ul>
      <div className="sidebar__logout">
        <button onClick={handleLogout}><i className="icon-logout"></i> Logout</button>
      </div>
      <div className="sidebar__footer">
        <p>&copy; 2024 SPECMX ERP</p>
      </div>
    </div>
  );
};

export default Sidebar;
