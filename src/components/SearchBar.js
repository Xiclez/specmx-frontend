import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({ endpoint, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(endpoint);
        setOptions(response.data);
        setFilteredOptions(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchOptions();
  }, [endpoint]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsDropdownOpen(true);

    const filtered = options.filter(option =>
      Object.values(option).some(value =>
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = (id) => {
    onSelect(id);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative flex flex-col">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar..."
        className="p-2 border border-gray-300 rounded text-sm mb-2"
        onFocus={() => setIsDropdownOpen(true)}
      />
      {isDropdownOpen && filteredOptions.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
          {filteredOptions.map((option) => (
            <li
              key={option._id}
              onClick={() => handleSelect(option._id)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {Object.values(option).join(' - ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
