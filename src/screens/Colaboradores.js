import React from 'react';
import TablaDinamica from '../components/Tabla';
import Topbar from '../components/Topbar';


export const Colaboradores = () => {
  const getEndpoint = 'http://localhost:3010/api/colaborador/getColaboradores';
  const createEndpoint = 'http://localhost:3010/api/colaborador/createColaborador';
  const updateEndpoint = 'http://localhost:3010/api/colaborador/updateColaborador';  // sin el ':id' porque se agregará dinámicamente
  const deleteEndpoint = 'http://localhost:3010/api/colaborador/deleteColaborador';  // sin el 'id' porque se agregará dinámicamente

  return (
    <div className="container mx-auto p-4">
            <Topbar breadcrumbs={["Empresas"]} />
      <TablaDinamica
        getEndpoint={getEndpoint}
        createEndpoint={createEndpoint}
        updateEndpoint={updateEndpoint}
        deleteEndpoint={deleteEndpoint}
      />
    </div>
  );
};

