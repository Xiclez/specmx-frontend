import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // Estado para el filtro seleccionado
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/client/getClients`)
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error('Error fetching client data:', error);
      });
  }, []);

  const isValidRegimen = (regimen) => {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    return regimen.Regimen && !dateRegex.test(regimen.Regimen) && regimen.FechaAlta;
  };

  const getRegimen = (regimenes) => {
    const validRegimenes = regimenes.filter(isValidRegimen);
    return validRegimenes.length > 0
      ? validRegimenes.map((r, index) => <div key={index}>{r.Regimen}</div>)
      : 'No disponible';
  };

  const getNombreRazonSocial = (identificacion) => {
    if (identificacion.Nombre && identificacion.ApellidoPaterno) {
      return `${identificacion.Nombre} ${identificacion.ApellidoPaterno}`;
    }
    return `${identificacion.DenominacionRazonSocial} ${identificacion.RegimenCapital}`;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleCreateClient = () => {
    navigate('/clientedit');
  };

  const filteredClients = clients.filter(client => {
    const nombreRazonSocial = getNombreRazonSocial(client.datosIdentificacion).toLowerCase();
    const rfc = client.datosIdentificacion.RFC ? client.datosIdentificacion.RFC.toLowerCase() : '';
    const cp = client.datosUbicacion.CP ? client.datosUbicacion.CP.toLowerCase() : '';
    const regimen = getRegimen(client.caracteristicasFiscales).toString().toLowerCase();

    const matchesSearchTerm = (
      nombreRazonSocial.includes(searchTerm.toLowerCase()) ||
      rfc.includes(searchTerm.toLowerCase()) ||
      cp.includes(searchTerm.toLowerCase()) ||
      regimen.includes(searchTerm.toLowerCase())
    );

    const isPhysical = client.datosIdentificacion.CURP !== '';
    const matchesFilter = (
      filter === 'all' ||
      (filter === 'physical' && isPhysical) ||
      (filter === 'moral' && !isPhysical)
    );

    return matchesSearchTerm && matchesFilter;
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Clientes</h1>
        <button className="bg-black text-white py-2 px-4 rounded" onClick={handleCreateClient}>Crear Cliente</button>
      </div>
      <div className="mb-4">
        <div className="flex space-x-4">
          <button
            className={`border-b-2 ${filter === 'all' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => handleFilterChange('all')}
          >
            Todos los Clientes
          </button>
          <button
            className={`border-b-2 ${filter === 'physical' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => handleFilterChange('physical')}
          >
            Personas Físicas
          </button>
          <button
            className={`border-b-2 ${filter === 'moral' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => handleFilterChange('moral')}
          >
            Personas Morales
          </button>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <button className="bg-gray-200 py-2 px-4 rounded">Filter by</button>
          <input
            type="text"
            placeholder="Buscar"
            className="border border-gray-300 py-2 px-4 rounded w-1/3"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="text-left py-2 px-4">No.</th>
            <th className="text-left py-2 px-4">ID de Cliente</th>
            <th className="text-left py-2 px-4">Nombre/Razon Social</th>
            <th className="text-left py-2 px-4">Ordenes Activas</th>
            <th className="text-left py-2 px-4">Regimen</th>
            <th className="text-left py-2 px-4">RFC</th>
            <th className="text-left py-2 px-4">Código Postal</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client, index) => (
            <tr key={client._id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{client._id}</td>
              <td className="py-2 px-4 truncate max-w-xs">{getNombreRazonSocial(client.datosIdentificacion)}</td>
              <td className="py-2 px-4 text-center">0</td>
              <td className="py-2 px-4">{getRegimen(client.caracteristicasFiscales)}</td>
              <td className="py-2 px-4">{client.datosIdentificacion.RFC}</td>
              <td className="py-2 px-4">{client.datosUbicacion.CP}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;