import React from 'react';
import TableComponent from './TableComponent';
import FormComponent from './FormComponent';

export const ProyectosTable = () => {
  const columns = [
    { Header: 'Nombre', accessor: 'nombre' },
    { Header: 'Descripción', accessor: 'descripcion' },
    { Header: 'Fecha de Inicio', accessor: 'fechaInicio' },
  ];

  return (
    <TableComponent
      resource="proyectos"
      columns={columns}
      fetchUrl="http://localhost:3010/api/proyecto/getProyectos"
      deleteUrl="http://localhost:3010/api/proyecto/deleteProyecto"
    />
  );
};

export const ProyectoForm = () => {
  const fields = [
    { label: 'Nombre', name: 'nombre', required: true },
    { label: 'Descripción', name: 'descripcion', required: true },
    { label: 'Fecha de Inicio', name: 'fechaInicio', type: 'date', required: true },
  ];

  return (
    <FormComponent
      resource="proyectos"
      fields={fields}
      fetchUrl="http://localhost:3010/api/proyecto/getProyecto"
      createUrl="http://localhost:3010/api/proyecto/createProyecto"
      updateUrl="http://localhost:3010/api/proyecto/updateProyecto"
    />
  );
};
