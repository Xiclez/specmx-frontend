import React from 'react';
import { useNavigate } from 'react-router-dom';
import TablaDinamica from '../components/Tabla';
import Topbar from '../components/Topbar';
import axios from 'axios';

export const Empresas = () => {
  const navigate = useNavigate();
  const getEndpoint = 'http://localhost:3010/api/empresa/getEmpresas';
  const createEndpoint = 'http://localhost:3010/api/empresa/createEmpresa';
  const updateEndpoint = 'http://localhost:3010/api/empresa/updateEmpresa';
  const deleteEndpoint = 'http://localhost:3010/api/empresa/deleteEmpresa';

  const handleUploadComplete = async (data) => {
    console.log('Datos recibidos en Empresas:', data);

    if (data.CURP && !data.DenominacionRazonSocial) {
      const confirmation = window.confirm('Has subido el CSF de una Persona Física, crear Cliente?');
      console.log('Confirmación del usuario:', confirmation);

      if (confirmation) {
        try {
          const response = await axios.post('http://localhost:3010/api/cliente/createCliente', data);
          console.log('Cliente creado:', response.data);
          navigate('/clientes');
        } catch (error) {
          console.error('Error al crear cliente:', error);
        }
      }
    } else {
      console.log('CSF subido corresponde a una empresa.');
      // Aquí puedes agregar la lógica para manejar empresas, si es necesario.
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Topbar breadcrumbs={["Empresas"]} />
      <TablaDinamica
        getEndpoint={getEndpoint}
        createEndpoint={createEndpoint}
        updateEndpoint={updateEndpoint}
        deleteEndpoint={deleteEndpoint}
        onUploadComplete={handleUploadComplete} // Asegúrate de que se pasa correctamente
      />
    </div>
  );
};

export default Empresas;
