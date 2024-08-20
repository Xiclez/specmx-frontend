import React from 'react';
import TableComponent from './TableComponent';
import FormComponent from './FormComponent';

export const TareasTable = () => {
  const columns = [
    { Header: 'Título', accessor: 'titulo' },
    { Header: 'Descripción', accessor: 'descripcion' },
    { Header: 'Fecha de Entrega', accessor: 'fechaEntrega' },
  ];

  return (
    <TableComponent
      resource="tareas"
      columns={columns}
      fetchUrl="http://localhost:3010/api/tarea/getTareas"
      deleteUrl="http://localhost:3010/api/tarea/deleteTarea"
    />
  );
};

export const TareaForm = () => {
  const fields = [
    { label: 'Título', name: 'titulo', required: true },
    { label: 'Descripción', name: 'descripcion', required: true },
    { label: 'Fecha de Entrega', name: 'fechaEntrega', type: 'date', required: true },
  ];

  return (
    <FormComponent
      resource="tareas"
      fields={fields}
      fetchUrl="http://localhost:3010/api/tarea/getTarea"
      createUrl="http://localhost:3010/api/tarea/createTarea"
      updateUrl="http://localhost:3010/api/tarea/updateTarea"
    />
  );
};
