import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Cambia useHistory por useNavigate
import { FaChevronDown } from 'react-icons/fa';

const Topbar = ({ breadcrumbs, userName, userPhoto }) => {
  const navigate = useNavigate(); // Cambia useHistory por useNavigate
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/home'); // Cambia history.push por navigate
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
      {/* Logo */}
      <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
        <img src="/path-to-logo.png" alt="Logo" className="h-8 mr-4" />
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="text-sm">
            {crumb}
            {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
          </span>
        ))}
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-4">
        <span className="text-sm">{userName}</span>
        <div className="relative">
          <img
            src={userPhoto}
            alt="User"
            className="h-8 w-8 rounded-full cursor-pointer"
            onClick={toggleUserMenu}
          />
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded shadow-lg z-10">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Perfil</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Configuraciones</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
