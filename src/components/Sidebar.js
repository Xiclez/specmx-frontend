import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Estilos específicos para el sidebar

const Sidebar = ({ toggleSidebar }) => {
  return (
    <div className="sidebar">
      <button className="close-btn" onClick={toggleSidebar}>×</button>
      <nav className="sidebar-nav">
        <ul>
          <li><Link to="/blog" onClick={toggleSidebar}>Blog</Link></li>
          <li><Link to="/clients" onClick={toggleSidebar}>Clientes</Link></li>
          <li><Link to="/orders" onClick={toggleSidebar}>Ordenes</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
