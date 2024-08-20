import React from 'react';
import TableComponent from './TableComponent';
import FormComponent from './FormComponent';

const ClientesTable = () => {
    const columns = [
      { Header: 'Nombre', accessor: 'nombre' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Teléfono', accessor: 'telefono' },
    ];
  
    return (
      <TableComponent
        resource="clientes"
        columns={columns}
        fetchUrl="http://localhost:3010/api/cliente/getClientes"
        deleteUrl="http://localhost:3010/api/cliente/deleteCliente"
      />
    );
  };
  
  const ClienteForm = () => {
    const fields = [
      { label: 'Nombre', name: 'nombre', required: true },
      { label: 'Dirección', name: 'direccion', required: true },
      { label: 'Teléfono', name: 'telefono', required: true },
      { label: 'Email', name: 'email', type: 'email', required: true },
      { label: 'RFC', name: 'RFC', required: true },
    ];
  
    return (
      <FormComponent
        resource="clientes"
        fields={fields}
        fetchUrl="http://localhost:3010/api/cliente/getCliente"
        createUrl="http://localhost:3010/api/cliente/createCliente"
        updateUrl="http://localhost:3010/api/cliente/updateCliente"
      />
    );
  };
  const EmpresasTable = () => {
    const columns = [
      { Header: 'Nombre', accessor: 'nombre' },
      { Header: 'Razón Social', accessor: 'razonSocial' },
      { Header: 'RFC', accessor: 'RFC' },
    ];
  
    return (
      <TableComponent
        resource="empresas"
        columns={columns}
        fetchUrl="http://localhost:3010/api/empresa/getEmpresas"
        deleteUrl="http://localhost:3010/api/empresa/deleteEmpresa"
      />
    );
  };
  
  const EmpresaForm = () => {
    const fields = [
      { label: 'Nombre', name: 'nombre', required: true },
      { label: 'Razón Social', name: 'razonSocial', required: true },
      { label: 'RFC', name: 'RFC', required: true },
      { label: 'Dirección', name: 'direccion', required: true },
    ];
  
    return (
      <FormComponent
        resource="empresas"
        fields={fields}
        fetchUrl="http://localhost:3010/api/empresa/getEmpresa"
        createUrl="http://localhost:3010/api/empresa/createEmpresa"
        updateUrl="http://localhost:3010/api/empresa/updateEmpresa"
      />
    );
  };

const TareasTable = () => {
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

const TareaForm = () => {
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

const ProyectosTable = () => {
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

const ProyectoForm = () => {
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

const FacturasTable = () => {
  const columns = [
    { Header: 'Número', accessor: 'numero' },
    { Header: 'Fecha de Emisión', accessor: 'fechaEmision' },
    { Header: 'Monto', accessor: 'monto' },
  ];

  return (
    <TableComponent
      resource="facturas"
      columns={columns}
      fetchUrl="http://localhost:3010/api/factura/getFacturas"
      deleteUrl="http://localhost:3010/api/factura/deleteFactura"
    />
  );
};

const FacturaForm = () => {
  const fields = [
    { label: 'Número', name: 'numero', required: true },
    { label: 'Fecha de Emisión', name: 'fechaEmision', type: 'date', required: true },
    { label: 'Monto', name: 'monto', type: 'number', required: true },
  ];

  return (
    <FormComponent
      resource="facturas"
      fields={fields}
      fetchUrl="http://localhost:3010/api/factura/getFactura"
      createUrl="http://localhost:3010/api/factura/createFactura"
      updateUrl="http://localhost:3010/api/factura/updateFactura"
    />
  );
};

const ServiciosTable = () => {
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

const ServicioForm = () => {
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

const ColaboradoresTable = () => {
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

const ColaboradorForm = () => {
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

const UsuariosTable = () => {
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

const UsuarioForm = () => {
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

export {
  ClientesTable, ClienteForm,
  EmpresasTable, EmpresaForm,
  TareasTable, TareaForm,
  ProyectosTable, ProyectoForm,
  FacturasTable, FacturaForm,
  ServiciosTable, ServicioForm,
  ColaboradoresTable, ColaboradorForm,
  UsuariosTable, UsuarioForm
};
