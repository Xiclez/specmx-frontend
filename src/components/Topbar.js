import React from 'react';
import { BellIcon } from '@heroicons/react/solid';
import { useLocation, Link } from 'react-router-dom';
import profileImage from '../assets/SPECMX2.png'; // Asegúrate de que la ruta sea correcta

const Topbar = () => {
  const location = useLocation();

  // Convertir la ruta en breadcrumbs
  const breadcrumbs = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow">
      {/* Left section with logo and breadcrumbs */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <Link to="/home">
          <img src={profileImage} alt="Logo" className="h-10 w-10 cursor-pointer" />
        </Link>

        {/* Breadcrumbs */}
        <nav className="flex items-center text-gray-500">
          {breadcrumbs.map((crumb, index) => {
            const path = `/${breadcrumbs.slice(0, index + 1).join('/')}`;
            return (
              <React.Fragment key={index}>
                <Link to={path} className="mx-2 capitalize text-blue-500 hover:text-blue-700">
                  {crumb.replace(/-/g, ' ')}
                </Link>
                {index < breadcrumbs.length - 1 && <span className="mx-2">&gt;</span>}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      
      {/* Right section with notifications and profile */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">2</span>
        </div>
        
        {/* User profile */}
        <div className="flex items-center space-x-2">
          <Link to="/home">
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer">P</div>
          </Link>
          <span className="text-gray-700 font-medium">Pixsellz</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
