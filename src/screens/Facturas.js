import React from 'react';
import TablaDinamica from '../components/Tabla';
import Topbar from '../components/Topbar';


export const Facturas = () => {
  const getEndpoint = 'http://localhost:3010/api/factura/getFacturas';
  const createEndpoint = 'http://localhost:3010/api/factura/createFactura';
  const updateEndpoint = 'http://localhost:3010/api/factura/updateFactura';  // sin el ':id' porque se agregará dinámicamente
  const deleteEndpoint = 'http://localhost:3010/api/factura/deleteFactura';  // sin el 'id' porque se agregará dinámicamente

  return (
    <div className="container mx-auto p-4">
      <Topbar breadcrumbs={["Facturas"]} />
      <TablaDinamica
        getEndpoint={getEndpoint}
        createEndpoint={createEndpoint}
        updateEndpoint={updateEndpoint}
        deleteEndpoint={deleteEndpoint}
      />
    </div>
  );
};

