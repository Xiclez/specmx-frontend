import React from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CogIcon,
  LogoutIcon,
  ChartPieIcon,
  OfficeBuildingIcon,
  UsersIcon,
  ClipboardListIcon,
  CollectionIcon,
} from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 bg-gray-900">
        <img src={require('../assets/SPECMX.png')} alt="Logo" className="h-12 w-auto" />
      </div>

      {/* Navegación */}
      <nav className="flex flex-col p-4 space-y-2">
        <SidebarItem icon={<HomeIcon className="h-6 w-6" />} label="Dashboard" to="/" />
        <SidebarItem icon={<UserGroupIcon className="h-6 w-6" />} label="Clientes" to="/clientes" />
        <SidebarItem icon={<OfficeBuildingIcon className="h-6 w-6" />} label="Empresas" to="/empresas" />
        <SidebarItem icon={<BriefcaseIcon className="h-6 w-6" />} label="Proyectos" to="/proyectos" />
        <SidebarItem icon={<ClipboardListIcon className="h-6 w-6" />} label="Tareas" to="/tareas" />
        <SidebarItem icon={<CollectionIcon className="h-6 w-6" />} label="Servicios" to="/servicios" />
        <SidebarItem icon={<DocumentTextIcon className="h-6 w-6" />} label="Facturas" to="/facturas" />
        <SidebarItem icon={<UsersIcon className="h-6 w-6" />} label="Colaboradores" to="/colaboradores" />
        <SidebarItem icon={<UsersIcon className="h-6 w-6" />} label="Usuarios" to="/usuarios" />
        <SidebarItem icon={<ChartPieIcon className="h-6 w-6" />} label="Reportes" to="/reportes" />
        <SidebarItem icon={<CogIcon className="h-6 w-6" />} label="Configuración" to="/configuracion" />
      </nav>

      {/* Separador */}
      <div className="border-t border-gray-700 mt-auto"></div>

      {/* Logout */}
      <div className="p-4">
        <SidebarItem icon={<LogoutIcon className="h-6 w-6" />} label="Salir" to="/logout" />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, to }) => {
  return (
    <Link
      to={to}
      className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
    >
      {icon}
      <span className="ml-4">{label}</span>
    </Link>
  );
};

export default Sidebar;
