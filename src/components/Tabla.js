import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Formulario from './Formulario';

const TablaDinamica = ({ getEndpoint, createEndpoint, updateEndpoint, deleteEndpoint }) => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [visibleHeaders, setVisibleHeaders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isCSFMode, setIsCSFMode] = useState(false);
  const [resourceData, setResourceData] = useState({});  // Para almacenar los datos de los recursos asociados

  const excludedFields = ['_id', 'createdAt', 'updatedAt', '__v'];

  const fetchData = async () => {
    try {
      const response = await axios.get(getEndpoint);
      const data = response.data;

      if (data.length > 0) {
        const headers = Object.keys(data[0]).filter(
          (header) => !excludedFields.includes(header)
        );
        setHeaders(headers);
        setVisibleHeaders(headers);
        setFilteredData(data);
      }

      setData(data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const fetchResource = async (field, resourceId) => {
    let recurso = field.replace('Id', '').toLowerCase();
    let endpoint = `http://localhost:3010/api/${recurso}/get${recurso.charAt(0).toUpperCase()}${recurso.slice(1)}/${resourceId}`;

    try {
      const response = await axios.get(endpoint);
      setResourceData((prevData) => ({
        ...prevData,
        [resourceId]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching ${recurso}:`, error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getEndpoint]);

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
    setExpandedRow(index);
    setIsCreateMode(false);
    setIsModalOpen(true);
    setSelectedField(null);
    setIsEditMode(false);
    setFormData(filteredData[index]);

    // Fetch resource data for fields ending in 'Id'
    Object.keys(filteredData[index]).forEach((field) => {
      if (field.endsWith('Id') && filteredData[index][field]?._id) {
        fetchResource(field, filteredData[index][field]._id);
      }
    });
  };

  const handleFieldClick = (index, field) => {
    setExpandedRow(index);
    setSelectedField(field);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    try {
      if (isCreateMode) {
        await axios.post(createEndpoint, formData);
      } else {
        await axios.put(`${updateEndpoint}/${formData._id}`, formData);
      }

      setIsModalOpen(false);
      setIsEditMode(false);
      setIsCreateMode(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  };

  const handleCreate = (fromCSF = false) => {
    setIsCreateMode(true);
    setIsEditMode(true);
    setIsModalOpen(true);
    setExpandedRow(null);
    setSelectedField(null);
    setFormData({});
    if (fromCSF) {
      setIsCSFMode(true); // Activa el modo CSF si se selecciona "Crear a partir de CSF"
    } else {
      setIsCSFMode(false); // Desactiva el modo CSF si se selecciona "Crear"
    }
  };

  const handleDelete = async () => {
    try {
      if (expandedRow !== null) {
        const idToDelete = filteredData[expandedRow]._id;
        await axios.delete(`${deleteEndpoint}/${idToDelete}`);
        setExpandedRow(null);
        setIsEditMode(false);
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setExpandedRow(null);
    setIsModalOpen(false);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleUploadComplete = (data) => {
    // Mapea automáticamente los datos recibidos desde CSF al formData
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
    setIsCSFMode(false);
  };

  const handleFileUpload = async (field, files) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append(field === 'profilePhoto' ? 'image' : 'file', files[0]);

    try {
      // Hacer la solicitud al servidor para subir el archivo
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/helper/uploadFile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Obtener la URL del archivo subido desde la respuesta
      const uploadedUrl = response.data.url;

      // Actualizar el estado con la nueva URL
      setFormData((prevData) => ({
        ...prevData,
        [field]: field === 'files' ? [...(prevData[field] || []), uploadedUrl] : uploadedUrl,
      }));
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  const handleFileClick = (fileUrl) => {
    const options = [];

    // Opción para ver el archivo
    options.push({
      label: 'Ver',
      action: () => {
        window.open(fileUrl, '_blank');
      }
    });

    // Opción para eliminar el archivo (solo en modo edición o creación)
    if (isEditMode || isCreateMode) {
      options.push({
        label: 'Eliminar',
        action: () => {
          setFormData((prevData) => ({
            ...prevData,
            files: prevData.files.filter((file) => file !== fileUrl),
          }));
        }
      });
    }

    // Mostrar un menú contextual o algún otro tipo de interfaz para mostrar estas opciones
    // Por simplicidad, usaré `window.prompt` pero puedes usar un menú más sofisticado según tus necesidades

    const selectedOption = window.prompt(
      `Opciones para el archivo:\n1. ${options[0].label}${options[1] ? `\n2. ${options[1].label}` : ''}`,
      '1'
    );

    if (selectedOption === '1') {
      options[0].action();
    } else if (selectedOption === '2' && options[1]) {
      options[1].action();
    }
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

  return (
    <div className="container mx-auto p-4 bg-gray-100 h-screen flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          onChange={(e) => handleSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                    onChange={() => handleToggleColumn(header)}
                    className="mr-2"
                  />
                  <label>{header}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => handleCreate(true)}
            className="p-2 bg-yellow-500 rounded"
          >
            Crear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto bg-white shadow-md rounded-md">
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
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Formulario
        isModalOpen={isModalOpen}
        isCreateMode={isCreateMode}
        isEditMode={isEditMode}
        isCSFMode={isCSFMode}
        formData={formData}
        headers={headers}
        resourceData={resourceData}
        onClose={handleCancel}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={handleDelete}
        onInputChange={handleInputChange}
        onFileUpload={handleFileUpload}
        onUploadComplete={handleUploadComplete}
        handleFileClick={handleFileClick}
      />
    </div>
  );
};

export default TablaDinamica;
