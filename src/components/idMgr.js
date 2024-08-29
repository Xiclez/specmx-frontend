import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IdMgr = ({ endpoint, onSelect, onDelete, existingIds = [], isEditMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(endpoint);
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchOptions();
  }, [endpoint]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredOptions([]);
      return;
    }

    const filtered = options.filter(option =>
      Object.values(option).some(value =>
        String(value).toLowerCase().includes(term.toLowerCase())
      ) && !existingIds.includes(option._id.toString())
    );

    setFilteredOptions(filtered);
  };

  const handleSelect = (id) => {
    const updatedIds = [...existingIds, id.toString()];
    onSelect(updatedIds); // Actualiza el estado con los IDs seleccionados
    setSearchTerm('');
    setFilteredOptions([]);
  };

  const renderOptionLabel = (option) => {
    if (!option) return 'No match';

    if (endpoint.includes('cliente')) {
      return `${option.Nombre} ${option.ApellidoPaterno}`;
    } else if (endpoint.includes('empresa')) {
      return `${option.DenominacionRazonSocial}`;
    } else if (endpoint.includes('proyecto') || endpoint.includes('tarea')) {
      return `${option.nombre} (${option.fechaInicio})`;
    } else if (endpoint.includes('servicio')) {
      return `${option.nombre} (${option.createdAt.split('T')[0]})`;
    } else if (endpoint.includes('factura') || endpoint.includes('colaborador')) {
      return `${option.nombre} ${option.apellido}`;
    } else if (endpoint.includes('usuario')) {
      return `${option.email}`;
    }
    return 'No match';
  };

  const handleDelete = async (id) => {
    try {
      await onDelete(id); // Suponiendo que onDelete elimina el ID de la base de datos
      setOptions(prevOptions => prevOptions.filter(option => option._id.toString() !== id));
      const updatedIds = existingIds.filter(existingId => existingId !== id);
      onSelect(updatedIds); // Actualiza el estado con los IDs restantes
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="relative flex flex-col">
      {isEditMode && (
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar..."
          className="p-2 border border-gray-300 rounded text-sm mb-2"
        />
      )}
      {filteredOptions.length > 0 && isEditMode && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
          {filteredOptions.map((option) => (
            <div
              key={option._id.toString()} // Asegúrate de que el key sea único y basado en una cadena de texto
              onClick={() => handleSelect(option._id)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {renderOptionLabel(option)}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col">
        {existingIds.length === 0 && !isEditMode ? (
          <div className="text-sm text-gray-500">No hay elementos asociados.</div>
        ) : (
          existingIds.map(id => {
            const item = options.find(option => option._id.toString() === id);
            return (
              <div key={id} className="flex items-center justify-between p-2 border-b border-gray-300">
                <span>{item ? renderOptionLabel(item) : 'No match'}</span>
                {isEditMode && (
                  <button onClick={() => handleDelete(id)} className="ml-2 p-1 bg-red-500 text-white rounded">
                    🗑️
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default IdMgr;
