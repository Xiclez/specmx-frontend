import React from 'react';
import TableComponent from './TableComponent';
import FormComponent from './FormComponent';

export const ServiciosTable = () => {
  const columns = [
    { Header: 'Nombre', accessor: 'nombre' },
    { Header: 'Descripción', accessor: 'descripcion' },
    { Header: 'Precio', accessor: 'precio' },
  ];

  return (
    <TableComponent
      resource="servicios"
      columns={columns}
      fetchUrl="http://localhost:3010/api/servicio/getServicios"
      deleteUrl="http://localhost:3010/api/servicio/deleteServicio"
    />
  );
};

export const ServicioForm = () => {
  const fields = [
    { label: 'Nombre', name: 'nombre', required: true },
    { label: 'Descripción', name: 'descripcion', required: true },
    { label: 'Precio', name: 'precio', type: 'number', required: true },
  ];

  return (
    <FormComponent
      resource="servicios"
      fields={fields}
      fetchUrl="http://localhost:3010/api/servicio/getServicio"
      createUrl="http://localhost:3010/api/servicio/createServicio"
      updateUrl="http://localhost:3010/api/servicio/updateServicio"
    />
  );
};
