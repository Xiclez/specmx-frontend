import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Asegúrate de que la ruta sea correcta
import { Clientes } from './screens/Clientes'; 
import { Empresas } from './screens/Empresas';
import { Test } from './screens/Test';
import { Test2 } from './screens/Test2';
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
          <Route path="/test" element={<Test />} />
          <Route path="/test2" element={<Test2 />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/create" element={<Clientes />} />
            <Route path="/clientes/edit/:id" element={<Clientes />} />
            <Route path="/clientes/view/:id" element={<Clientes />} />
           
            <Route path="/empresas" element={<Empresas />} />
             
            <Route path="/empresas/create" element={<Empresas />} />
            <Route path="/empresas/edit/:id" element={<Empresas />} />
            <Route path="/empresas/view/:id" element={<Empresas />} />
{/*
            <Route path="/tareas" element={<TareasTable />} />
            <Route path="/tareas/create" element={<TareaForm />} />
            <Route path="/tareas/edit/:id" element={<TareaForm />} />
            <Route path="/tareas/view/:id" element={<TareaForm />} />

            <Route path="/proyectos" element={<ProyectosTable />} />
            <Route path="/proyectos/create" element={<ProyectoForm />} />
            <Route path="/proyectos/edit/:id" element={<ProyectoForm />} />
            <Route path="/proyectos/view/:id" element={<ProyectoForm />} />

            <Route path="/facturas" element={<FacturasTable />} />
            <Route path="/facturas/create" element={<FacturaForm />} />
            <Route path="/facturas/edit/:id" element={<FacturaForm />} />
            <Route path="/facturas/view/:id" element={<FacturaForm />} />

            <Route path="/servicios" element={<ServiciosTable />} />
            <Route path="/servicios/create" element={<ServicioForm />} />
            <Route path="/servicios/edit/:id" element={<ServicioForm />} />
            <Route path="/servicios/view/:id" element={<ServicioForm />} />

            <Route path="/colaboradores" element={<ColaboradoresTable />} />
            <Route path="/colaboradores/create" element={<ColaboradorForm />} />
            <Route path="/colaboradores/edit/:id" element={<ColaboradorForm />} />
            <Route path="/colaboradores/view/:id" element={<ColaboradorForm />} />

            <Route path="/usuarios" element={<UsuariosTable />} />
            <Route path="/usuarios/create" element={<UsuarioForm />} />
            <Route path="/usuarios/edit/:id" element={<UsuarioForm />} />
            <Route path="/usuarios/view/:id" element={<UsuarioForm />} />

             Añade más rutas aquí si es necesario */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
