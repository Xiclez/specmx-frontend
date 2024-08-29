import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabla from '../components/Tabla';
import Topbar from '../components/Topbar';
import axios from 'axios';

export const Clientes = () => {
  const navigate = useNavigate();
  const getEndpoint = 'http://localhost:3010/api/cliente/getClientes';
  const createEndpoint = 'http://localhost:3010/api/cliente/createCliente';
  const updateEndpoint = 'http://localhost:3010/api/cliente/updateCliente';
  const deleteEndpoint = 'http://localhost:3010/api/cliente/deleteCliente';

  const handleUploadComplete = async (data) => {
    console.log('Datos recibidos en Clientes:', data);

    if (!data.CURP && data.DenominacionRazonSocial) {
      const confirmation = window.confirm('Has subido el CSF de una Persona Moral, crear Empresa?');
      console.log('Confirmación del usuario:', confirmation);

      if (confirmation) {
        try {
          const response = await axios.post('http://localhost:3010/api/empresa/createEmpresa', data);
          console.log('Empresa creada:', response.data);
          navigate('/empresas');
        } catch (error) {
          console.error('Error al crear empresa:', error);
        }
      }
    } else {
      console.log('CSF subido corresponde a un cliente.');
      // Aquí puedes agregar la lógica para manejar clientes, si es necesario.
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Topbar breadcrumbs={["Clientes"]} />
      <Tabla
        getEndpoint={getEndpoint}
        createEndpoint={createEndpoint}
        updateEndpoint={updateEndpoint}
        deleteEndpoint={deleteEndpoint}
        onUploadComplete={handleUploadComplete} // Asegúrate de que se pasa correctamente
      />
    </div>
  );
};
