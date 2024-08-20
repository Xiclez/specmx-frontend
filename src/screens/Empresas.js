import React, { useState, useEffect } from 'react';
import FormComponent from '../components/FormComponent';
import TableComponent from '../components/TableComponent';
import { useLocation, useParams } from 'react-router-dom';

export const Empresas = () => {
  const location = useLocation();
  const { id } = useParams();
  const isFormView = location.pathname.includes('/empresas/create') || location.pathname.includes('/empresas/edit') || location.pathname.includes('/empresas/view');
  const [activeTab, setActiveTab] = useState('identificacion');
  const [formData, setFormData] = useState({
    nombre: '',
    DenominacionRazonSocial: '',
    RegimenCapital: '',
    FechaConstitucion: '',
    RFC: '',
    telefono: '',
    email: '',
    sector: '',
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

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3010/api/empresa/getEmpresa/${id}`)
        .then(response => response.json())
        .then(data => {
          setFormData({
            ...data,
            direccion: data.direccion?.length ? data.direccion : [{
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
        .catch(error => console.error('Error fetching empresa data:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
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

  const empresaFieldsIdentificacion = [
    { name: 'nombre', label: 'Nombre', required: true, value: formData.nombre },
    { name: 'DenominacionRazonSocial', label: 'Denominación o Razón Social', value: formData.DenominacionRazonSocial },
    { name: 'RegimenCapital', label: 'Régimen de Capital', value: formData.RegimenCapital },
    { name: 'FechaConstitucion', label: 'Fecha de Constitución', type: 'date', value: formData.FechaConstitucion },
    { name: 'RFC', label: 'RFC', required: true, value: formData.RFC },
    { name: 'telefono', label: 'Teléfono', value: formData.telefono },
    { name: 'email', label: 'Correo Electrónico', value: formData.email },
    { name: 'sector', label: 'Sector', value: formData.sector },
  ];

  const empresaFieldsUbicacion = [
    { name: 'direccion.0.EntidadFederativa', label: 'Entidad Federativa', required: true, value: formData.direccion[0].EntidadFederativa },
    { name: 'direccion.0.MunicipioDelegacion', label: 'Municipio o Delegación', required: true, value: formData.direccion[0].MunicipioDelegacion },
    { name: 'direccion.0.Colonia', label: 'Colonia', required: true, value: formData.direccion[0].Colonia },
    { name: 'direccion.0.NombreVialidad', label: 'Nombre de Vialidad', required: true, value: formData.direccion[0].NombreVialidad },
    { name: 'direccion.0.NumeroExterior', label: 'Número Exterior', required: true, value: formData.direccion[0].NumeroExterior },
    { name: 'direccion.0.NumeroInterior', label: 'Número Interior', value: formData.direccion[0].NumeroInterior },
    { name: 'direccion.0.CP', label: 'Código Postal', required: true, value: formData.direccion[0].CP },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestOptions = {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    };
    const endpoint = id ? `http://localhost:3010/api/empresa/updateEmpresa/${id}` : `http://localhost:3010/api/empresa/createEmpresa`;

    fetch(endpoint, requestOptions)
      .then(response => response.json())
      .then(() => {
        window.location.href = '/empresas';
      })
      .catch(error => console.error('Error submitting form:', error));
  };

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
          <form onSubmit={handleSubmit}>
            {activeTab === 'identificacion' && empresaFieldsIdentificacion.map(field => (
              <div key={field.name} className="mb-4">
                <label className="block text-gray-700">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required={field.required}
                />
              </div>
            ))}
            {activeTab === 'ubicacion' && empresaFieldsUbicacion.map(field => (
              <div key={field.name} className="mb-4">
                <label className="block text-gray-700">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required={field.required}
                />
              </div>
            ))}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-300"
              >
                {id ? 'Actualizar Empresa' : 'Crear Empresa'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <TableComponent
          resource="empresas"
          columns={[
            { Header: 'Nombre', accessor: 'nombre' },
            { Header: 'RFC', accessor: 'RFC' },
            { Header: 'Teléfono', accessor: 'telefono' },
            { Header: 'Correo Electrónico', accessor: 'email' },
            { Header: 'Código Postal', accessor: 'direccion[0].CP' },
          ]}
          fetchUrl="http://localhost:3010/api/empresa/getEmpresas"
          deleteUrl="http://localhost:3010/api/empresa/deleteEmpresa"
        />
      )}
    </div>
  );
};

export default Empresas;
