import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({ endpoint, onSelect }) => {
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
      )
    );

    setFilteredOptions(filtered);
  };

  const handleSelect = (id) => {
    onSelect(id);
    setSearchTerm('');
    setFilteredOptions([]);
  };

  const renderOptionLabel = (option) => {
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

  return (
    <div className="relative flex flex-col">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar..."
        className="p-2 border border-gray-300 rounded text-sm mb-2"
      />
      {filteredOptions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
          {filteredOptions.map((option) => (
            <div
              key={option._id}
              onClick={() => handleSelect(option._id)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {renderOptionLabel(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
