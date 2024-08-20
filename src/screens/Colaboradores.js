import React from 'react';
import TableComponent from './TableComponent';
import FormComponent from './FormComponent';

export const ColaboradoresTable = () => {
  const columns = [
    { Header: 'Nombre', accessor: 'nombre' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Teléfono', accessor: 'telefono' },
  ];

  return (
    <TableComponent
      resource="colaboradores"
      columns={columns}
      fetchUrl="http://localhost:3010/api/colaborador/getColaboradores"
      deleteUrl="http://localhost:3010/api/colaborador/deleteColaborador"
    />
  );
};

export const ColaboradorForm = () => {
  const fields = [
    { label: 'Nombre', name: 'nombre', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Teléfono', name: 'telefono', required: true },
  ];

  return (
    <FormComponent
      resource="colaboradores"
      fields={fields}
      fetchUrl="http://localhost:3010/api/colaborador/getColaborador"
      createUrl="http://localhost:3010/api/colaborador/createColaborador"
      updateUrl="http://localhost:3010/api/colaborador/updateColaborador"
    />
  );
};
