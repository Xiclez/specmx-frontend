import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/solid';

const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedClients, setSelectedClients] = useState([]);
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

  const getNombreRazonSocial = (identificacion) => {
    if (identificacion.Nombre && identificacion.ApellidoPaterno) {
      return `${identificacion.Nombre} ${identificacion.ApellidoPaterno}`;
    }
    return `${identificacion.DenominacionRazonSocial} ${identificacion.RegimenCapital}`;
  };

  const handleCheckboxChange = (clientId) => {
    setSelectedClients(prevSelected => {
      if (prevSelected.includes(clientId)) {
        return prevSelected.filter(id => id !== clientId);
      } else {
        return [...prevSelected, clientId];
      }
    });
  };

  const handleEditClick = () => {
    if (selectedClients.length === 1) {
      navigate(`/client/edit/${selectedClients[0]}`, { state: { mode: 'edit' } });
    }
  };

  const handleViewClick = () => {
    if (selectedClients.length === 1) {
      navigate(`/client/view/${selectedClients[0]}`, { state: { mode: 'view' } });
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm('¿Está seguro de que desea eliminar los clientes seleccionados?')) {
      selectedClients.forEach(clientId => {
        axios.delete(`${process.env.REACT_APP_API_URL}/api/client/deleteClient/${clientId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
          setClients(prevClients => prevClients.filter(client => client._id !== clientId));
          setSelectedClients([]);
        })
        .catch(error => console.error('Error deleting client:', error));
      });
    }
  };

  const filteredClients = clients.filter(client => {
    const nombreRazonSocial = getNombreRazonSocial(client.datosIdentificacion).toLowerCase();
    const rfc = client.datosIdentificacion.RFC ? client.datosIdentificacion.RFC.toLowerCase() : '';
    const cp = client.datosUbicacion.CP ? client.datosUbicacion.CP.toLowerCase() : '';

    const matchesSearchTerm = (
      nombreRazonSocial.includes(searchTerm.toLowerCase()) ||
      rfc.includes(searchTerm.toLowerCase()) ||
      cp.includes(searchTerm.toLowerCase())
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
        <button className="bg-black text-white py-2 px-4 rounded" onClick={() => navigate('/client/create')}>Crear Cliente</button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            className={`border-b-2 ${filter === 'all' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setFilter('all')}
          >
            Todos los Clientes
          </button>
          <button
            className={`border-b-2 ${filter === 'physical' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setFilter('physical')}
          >
            Personas Físicas
          </button>
          <button
            className={`border-b-2 ${filter === 'moral' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setFilter('moral')}
          >
            Personas Morales
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <EyeIcon
            className={`h-6 w-6 text-blue-500 ${selectedClients.length !== 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={handleViewClick}
            disabled={selectedClients.length !== 1}
          />
          <PencilIcon
            className={`h-6 w-6 text-gray-500 ${selectedClients.length !== 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={handleEditClick}
            disabled={selectedClients.length !== 1}
          />
          <TrashIcon
            className="h-6 w-6 text-red-500 cursor-pointer"
            onClick={handleDeleteClick}
          />
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar"
          className="border border-gray-300 py-2 px-4 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="text-left py-2 px-4">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedClients(filteredClients.map(client => client._id));
                  } else {
                    setSelectedClients([]);
                  }
                }}
                checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
              />
            </th>
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
              <td className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client._id)}
                  onChange={() => handleCheckboxChange(client._id)}
                />
              </td>
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{client._id}</td>
              <td className="py-2 px-4 truncate max-w-xs">{getNombreRazonSocial(client.datosIdentificacion)}</td>
              <td className="py-2 px-4 text-center">0</td>
              <td className="py-2 px-4">{client.caracteristicasFiscales.map((fiscal, i) => (
                <span key={i}>{fiscal.Regimen}{i < client.caracteristicasFiscales.length - 1 && ', '}</span>
              ))}</td>
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
