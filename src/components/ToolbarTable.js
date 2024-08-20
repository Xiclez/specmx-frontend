import React, { useState } from 'react';

const ToolbarTable = ({ headers, onSearch, onCreate, onToggleColumn, visibleHeaders }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleColumnToggle = (header) => {
    onToggleColumn(header);
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <input
        type="text"
        placeholder="Buscar..."
        onChange={(e) => onSearch(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="p-2 bg-gray-200 rounded"
        >
          Mostrar
        </button>
        {isDropdownOpen && (
          <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
            {headers.map((header) => (
              <div key={header} className="flex items-center p-2">
                <input
                  type="checkbox"
                  checked={visibleHeaders.includes(header)}
                  onChange={() => handleColumnToggle(header)}
                  className="mr-2"
                />
                <label>{header}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onCreate}
        className="p-2 bg-yellow-500 text-white rounded"
      >
        Crear
      </button>
    </div>
  );
};

export default ToolbarTable;
