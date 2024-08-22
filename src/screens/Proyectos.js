import React from 'react';
import TablaDinamica from '../components/Tabla';
import Topbar from '../components/Topbar';


export const Proyectos = () => {
  const getEndpoint = 'http://localhost:3010/api/proyecto/getProyectos';
  const createEndpoint = 'http://localhost:3010/api/proyecto/createProyecto';
  const updateEndpoint = 'http://localhost:3010/api/proyecto/updateProyecto';  // sin el ':id' porque se agregará dinámicamente
  const deleteEndpoint = 'http://localhost:3010/api/proyecto/deleteProyecto';  // sin el 'id' porque se agregará dinámicamente

  return (
    <div className="container mx-auto p-4">
      <Topbar breadcrumbs={["Proyectos"]} />
      <TablaDinamica
        getEndpoint={getEndpoint}
        createEndpoint={createEndpoint}
        updateEndpoint={updateEndpoint}
        deleteEndpoint={deleteEndpoint}
      />
    </div>
  );
};

