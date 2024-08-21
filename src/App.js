import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Asegúrate de que la ruta sea correcta
import { Clientes } from './screens/Clientes'; 
import { Empresas } from './screens/Empresas';
import { Proyectos } from './screens/Proyectos';
import { Tareas } from './screens/Tareas';
import { Facturas } from './screens/Facturas';
import { Servicios } from './screens/Servicios';
import { Colaboradores } from './screens/Colaboradores';
import { Usuarios } from './screens/Usuarios';

/*
import { TareasTable, TareaForm } from './components/Tareas';
import { ProyectosTable, ProyectoForm } from './components/Proyectos';
import { FacturasTable, FacturaForm } from './components/Facturas';
import { ServiciosTable, ServicioForm } from './components/Servicios';
import { ColaboradoresTable, ColaboradorForm } from './components/Colaboradores';
import { UsuariosTable, UsuarioForm } from './components/Usuarios';
*/

const App = () => {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100">
          <Routes>
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/create" element={<Clientes />} />
            <Route path="/clientes/edit/:id" element={<Clientes />} />
            <Route path="/clientes/view/:id" element={<Clientes />} />
           
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/empresas/create" element={<Empresas />} />
            <Route path="/empresas/edit/:id" element={<Empresas />} />
            <Route path="/empresas/view/:id" element={<Empresas />} />

            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/proyectos/create" element={<Proyectos />} />
            <Route path="/proyectos/edit/:id" element={<Proyectos />} />
            <Route path="/proyectos/view/:id" element={<Proyectos />} />

            <Route path="/tareas" element={<Tareas />} />
            <Route path="/tareas/create" element={<Tareas />} />
            <Route path="/tareas/edit/:id" element={<Tareas />} />
            <Route path="/tareas/view/:id" element={<Tareas />} />


            <Route path="/facturas" element={<Facturas />} />
            <Route path="/facturas/create" element={<Facturas />} />
            <Route path="/facturas/edit/:id" element={<Facturas />} />
            <Route path="/facturas/view/:id" element={<Facturas />} />

            <Route path="/servicios" element={<Servicios />} />
            <Route path="/servicios/create" element={<Servicios />} />
            <Route path="/servicios/edit/:id" element={<Servicios />} />
            <Route path="/servicios/view/:id" element={<Servicios />} />

            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/colaboradores/create" element={<Colaboradores />} />
            <Route path="/colaboradores/edit/:id" element={<Colaboradores />} />
            <Route path="/colaboradores/view/:id" element={<Colaboradores />} />

            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/create" element={<Usuarios />} />
            <Route path="/usuarios/edit/:id" element={<Usuarios />} />
            <Route path="/usuarios/view/:id" element={<Usuarios />} />

            
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
