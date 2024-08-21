import React from 'react';
import TablaDinamica from '../components/Tabla';

export const Tareas = () => {
  const getEndpoint = 'http://localhost:3010/api/tarea/getTareas';
  const createEndpoint = 'http://localhost:3010/api/tarea/createTarea';
  const updateEndpoint = 'http://localhost:3010/api/tarea/updateTarea';  // sin el ':id' porque se agregará dinámicamente
  const deleteEndpoint = 'http://localhost:3010/api/tarea/deleteTarea';  // sin el 'id' porque se agregará dinámicamente

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Datos de la API</h1>
      <TablaDinamica
        getEndpoint={getEndpoint}
        createEndpoint={createEndpoint}
        updateEndpoint={updateEndpoint}
        deleteEndpoint={deleteEndpoint}
      />
    </div>
  );
};

