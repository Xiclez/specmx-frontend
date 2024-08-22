import React from 'react';
import Tabla from '../components/Tabla';
import Topbar from '../components/Topbar';

export const Clientes = () => {
  const getEndpoint = 'http://localhost:3010/api/cliente/getClientes';
  const createEndpoint = 'http://localhost:3010/api/cliente/createCliente';
  const updateEndpoint = 'http://localhost:3010/api/cliente/updateCliente';  // sin el ':id' porque se agregará dinámicamente
  const deleteEndpoint = 'http://localhost:3010/api/cliente/deleteCliente';  // sin el 'id' porque se agregará dinámicamente

  return (
    <div className="container mx-auto p-4">
<Topbar breadcrumbs={["Clientes"]} />
<Tabla
        getEndpoint={getEndpoint}
        createEndpoint={createEndpoint}
        updateEndpoint={updateEndpoint}
        deleteEndpoint={deleteEndpoint}
      />
    </div>
  );
};

