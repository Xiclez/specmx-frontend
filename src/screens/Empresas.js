import React from 'react';
import TablaDinamica from '../components/Tabla';

export const Empresas = () => {
  const getEndpoint = 'http://localhost:3010/api/empresa/getEmpresas';
  const createEndpoint = 'http://localhost:3010/api/empresa/createEmpresa';
  const updateEndpoint = 'http://localhost:3010/api/empresa/updateEmpresa';  // sin el ':id' porque se agregará dinámicamente
  const deleteEndpoint = 'http://localhost:3010/api/empresa/deleteEmpresa';  // sin el 'id' porque se agregará dinámicamente

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Empresas</h1>
      <TablaDinamica
        getEndpoint={getEndpoint}
        createEndpoint={createEndpoint}
        updateEndpoint={updateEndpoint}
        deleteEndpoint={deleteEndpoint}
      />
    </div>
  );
};

export default Empresas;
