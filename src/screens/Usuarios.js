import React from 'react';
import TableComponent from './TableComponent';
import FormComponent from './FormComponent';

export const UsuariosTable = () => {
  const columns = [
    { Header: 'Usuario', accessor: 'username' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Rol', accessor: 'rol' },
  ];

  return (
    <TableComponent
      resource="usuarios"
      columns={columns}
      fetchUrl="http://localhost:3010/api/usuario/getUsuarios"
      deleteUrl="http://localhost:3010/api/usuario/deleteUsuario"
    />
  );
};

export const UsuarioForm = () => {
  const fields = [
    { label: 'Usuario', name: 'username', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Rol', name: 'rol', required: true },
  ];

  return (
    <FormComponent
      resource="usuarios"
      fields={fields}
      fetchUrl="http://localhost:3010/api/usuario/getUsuario"
      createUrl="http://localhost:3010/api/usuario/createUsuario"
      updateUrl="http://localhost:3010/api/usuario/updateUsuario"
    />
  );
};
