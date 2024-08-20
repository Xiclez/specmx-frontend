import React, { useState, useEffect } from 'react';
import FormComponent from '../components/FormComponent';
import TableComponent from '../components/TableComponent';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

// Definición de campos antes del componente Clientes
const clienteFieldsIdentificacion = [
  { name: 'Nombre', label: 'Nombre', required: true },
  { name: 'ApellidoPaterno', label: 'Apellido Paterno', required: true },
  { name: 'ApellidoMaterno', label: 'Apellido Materno' },
  { name: 'FechaNacimiento', label: 'Fecha de Nacimiento', type: 'date' },
  { name: 'RFC', label: 'RFC', required: true },
  { name: 'CURP', label: 'CURP' },
  { name: 'telefono', label: 'Teléfono' },
  { name: 'email', label: 'Correo Electrónico', required: true },
];

const clienteFieldsUbicacion = [
  { name: 'direccion.0.EntidadFederativa', label: 'Entidad Federativa', required: true },
  { name: 'direccion.0.MunicipioDelegacion', label: 'Municipio o Delegación', required: true },
  { name: 'direccion.0.Colonia', label: 'Colonia', required: true },
  { name: 'direccion.0.NombreVialidad', label: 'Nombre de Vialidad', required: true },
  { name: 'direccion.0.NumeroExterior', label: 'Número Exterior', required: true },
  { name: 'direccion.0.NumeroInterior', label: 'Número Interior' },
  { name: 'direccion.0.CP', label: 'Código Postal', required: true },
];

export const Clientes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isFormView = location.pathname.includes('/clientes/create') || location.pathname.includes('/clientes/edit') || location.pathname.includes('/clientes/view');

  const [activeTab, setActiveTab] = useState('identificacion');
  const [formData, setFormData] = useState({
    Nombre: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    FechaNacimiento: '',
    RFC: '',
    CURP: '',
    telefono: '',
    email: '',
    direccion: [
      {
        EntidadFederativa: '',
        MunicipioDelegacion: '',
        Colonia: '',
        NombreVialidad: '',
        NumeroExterior: '',
        NumeroInterior: '',
        CP: ''
      }
    ]
  });

  const [isEditable, setIsEditable] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (id && isFormView) {
      fetch(`http://localhost:3010/api/cliente/getCliente/${id}`)
        .then(response => response.json())
        .then(data => {
          setFormData({
            ...data,
            direccion: data.direccion.length ? data.direccion : [{
              EntidadFederativa: '',
              MunicipioDelegacion: '',
              Colonia: '',
              NombreVialidad: '',
              NumeroExterior: '',
              NumeroInterior: '',
              CP: ''
            }]
          });
        })
        .catch(error => console.error('Error fetching client data:', error));
    }
  }, [id, isFormView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    setIsChanged(true);
    if (keys.length === 2 && keys[0] === 'direccion') {
      setFormData(prevData => ({
        ...prevData,
        direccion: prevData.direccion.map((dir, idx) =>
          idx === 0 ? { ...dir, [keys[1]]: value } : dir
        )
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
    navigate(`/clientes/edit/${id}`);
  };

  const handleSave = () => {
    const requestOptions = {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    };
    const endpoint = id ? `http://localhost:3010/api/cliente/updateCliente/${id}` : 'http://localhost:3010/api/cliente/createCliente';

    fetch(endpoint, requestOptions)
      .then(response => response.json())
      .then((data) => {
        setIsEditable(false);
        setIsChanged(false);
        navigate(`/clientes/view/${data._id || id}`);
      })
      .catch(error => console.error('Error submitting form:', error));
  };

  const handleDelete = () => {
    fetch(`http://localhost:3010/api/cliente/deleteCliente/${id}`, {
      method: 'DELETE',
    })
      .then(() => navigate('/clientes'))
      .catch(error => console.error('Error deleting client:', error));
  };

  const handleCreate = () => {
    setIsEditable(true);
    navigate('/clientes/create');
  };

  const handleSearch = (searchTerm) => {
    // Lógica de búsqueda si es necesario
  };

  const tabs = [
    {
      name: 'identificacion',
      label: 'Datos de Identificación',
      fields: clienteFieldsIdentificacion
    },
    {
      name: 'ubicacion',
      label: 'Datos de Ubicación',
      fields: clienteFieldsUbicacion
    }
  ];

  return (
    <div className="container mx-auto p-4">
      
      {isFormView ? (
        <div>
          <div className="flex mb-4">
            <button
              className={`py-2 px-4 ${activeTab === 'identificacion' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'} rounded-l`}
              onClick={() => setActiveTab('identificacion')}
            >
              Datos de Identificación
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'ubicacion' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'} rounded-r`}
              onClick={() => setActiveTab('ubicacion')}
            >
              Datos de Ubicación
            </button>
          </div>
          <FormComponent
            resource="clientes"
            tabs={tabs}
            fetchUrl={`http://localhost:3010/api/cliente/getCliente`}
            createUrl={`http://localhost:3010/api/cliente/createCliente`}
            updateUrl={`http://localhost:3010/api/cliente/updateCliente`}
            formData={formData}
            onChange={handleChange}
            isEditable={isEditable}
          />
        </div>
      ) : (
        <TableComponent
          resource="clientes"
          columns={[
            { Header: 'Nombre Completo', accessor: 'Nombre' },
            { Header: 'RFC', accessor: 'RFC' },
            { Header: 'Teléfono', accessor: 'telefono' },
            { Header: 'Correo Electrónico', accessor: 'email' },
            { Header: 'Código Postal', accessor: 'direccion[0].CP' },
          ]}
          fetchUrl="http://localhost:3010/api/cliente/getClientes"
          deleteUrl="http://localhost:3010/api/cliente/deleteCliente"
        />
      )}
    </div>
  );
};
