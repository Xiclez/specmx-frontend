import React from 'react';
import TableComponent from './TableComponent';
import FormComponent from './FormComponent';

export const FacturasTable = () => {
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

export const FacturaForm = () => {
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
