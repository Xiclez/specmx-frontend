import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toolbar from './ToolbarTable';

const TablaDinamica = ({ endpoint }) => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [visibleHeaders, setVisibleHeaders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoint);
        const data = response.data;

        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          setHeaders(headers);
          setVisibleHeaders(headers);
          setFilteredData(data);
        }

        setData(data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [endpoint]);

  const handleSearch = (term) => {
    const filtered = data.filter((item) =>
      headers.some((header) => String(item[header]).toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  const handleToggleColumn = (header) => {
    const newVisibleHeaders = visibleHeaders.includes(header)
      ? visibleHeaders.filter((col) => col !== header)
      : [...visibleHeaders, header];
    setVisibleHeaders(newVisibleHeaders);
  };

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
    setSelectedField(null);
    setIsEditMode(false); // Reset edit mode when row is selected
  };

  const handleFieldClick = (index, field) => {
    setExpandedRow(index);
    setSelectedField(field);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    setIsEditMode(false);
  };

  const handleCreate = () => {
    setExpandedRow(null); // Close any open form
    setSelectedField(null);
    setIsEditMode(true); // Set to edit mode for new record
    // Aquí puedes agregar lógica para inicializar un nuevo registro
  };

  const handleDelete = () => {
    if (expandedRow !== null) {
      const idToDelete = filteredData[expandedRow]._id;
      // Aquí iría la lógica para eliminar el registro
      setExpandedRow(null);
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setExpandedRow(null);
  };

  const renderCell = (value, header, index) => {
    if (Array.isArray(value)) {
      return (
        <button
          onClick={() => handleFieldClick(index, header)}
          className="text-blue-500 hover:underline"
        >
          Ver Detalles
        </button>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <ul className="list-disc list-inside">
          {Object.entries(value).map(([key, val]) => (
            <li key={key}>{`${key}: ${val}`}</li>
          ))}
        </ul>
      );
    }
    return value;
  };

  const renderFormField = (field, value) => {
    if (Array.isArray(value)) {
      return (
        <div key={field} className="space-y-4 col-span-1">
          <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">{field}</h4>
          {value.map((item, index) => (
            <div key={index} className="space-y-2 pl-4 border-l-2 border-gray-200">
              <h5 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Elemento {index + 1}</h5>
              {Object.keys(item).map((subKey) => (
                <div key={subKey} className="flex flex-col">
                  <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">{subKey}</label>
                  <input
                    type="text"
                    value={item[subKey]}
                    readOnly={!isEditMode}
                    className="p-2 border border-gray-300 rounded text-sm"
                    style={{ width: 'auto' }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div key={field} className="flex flex-col col-span-1">
          <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">{field}</label>
          <ul className="list-disc list-inside">
            {Object.entries(value).map(([key, val]) => (
              <li key={key}>
                {key}: {val}
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div key={field} className="flex flex-col col-span-1">
          <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">{field}</label>
          <input
            type="text"
            value={value}
            readOnly={!isEditMode}
            className="p-2 border border-gray-300 rounded text-sm"
            style={{ width: 'auto' }}
          />
        </div>
      );
    }
  };

  const renderForm = (item, field) => {
    if (selectedField) {
      return renderFormField(field, item[field]);
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleHeaders.map((header) => renderFormField(header, item[header]))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 h-screen flex flex-col">
      <Toolbar
        headers={headers}
        onSearch={handleSearch}
        onToggleColumn={handleToggleColumn}
        onEdit={handleEdit}
        onSave={handleSave}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onCancel={handleCancel}
        isFormOpen={expandedRow !== null}
        isEditMode={isEditMode}
      />
      <div className="flex-1 overflow-hidden">
        <div className="h-1/2 overflow-y-auto bg-white shadow-md rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {visibleHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <React.Fragment key={index}>
                  <tr
                    onClick={() => handleRowClick(index)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    {visibleHeaders.map((header) => (
                      <td
                        key={header}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        <div className="text-sm text-gray-500">
                          {renderCell(item[header], header, index)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  {expandedRow === index && (
                    <tr>
                      <td colSpan={visibleHeaders.length} className="p-4 bg-gray-50">
                        <div className="transition-transform transform-gpu origin-top animate-slide-down">
                          <h3 className="text-lg font-bold mb-2">
                            Detalles del Elemento Seleccionado
                          </h3>
                          <div className="overflow-y-auto max-h-96">
                            {renderForm(item, selectedField)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaDinamica;
