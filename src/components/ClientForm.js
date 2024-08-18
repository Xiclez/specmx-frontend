import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CsfUploader, { extractQrCodeUrl } from './CsfUploader';
import estadosMunicipios from '../assets/estados-municipios.json';
import regimenesFiscales from '../assets/c_RegimenFiscal.json';
import TipoVialidad from '../assets/vialidades.json';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/solid';


const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientType, setClientType] = useState('physical');
  const [clientData, setClientData] = useState({
    RFC: '', CURP: '', Nombre: '', ApellidoPaterno: '', ApellidoMaterno: '', FechaNacimiento: '',
    FechaInicioOperaciones: '', SituacionContribuyente: '', FechaUltimoCambioSituacion: '',
    DenominacionRazonSocial: '', RegimenCapital: '', FechaConstitucion: '',
    datosUbicacion: {
      EntidadFederativa: '', MunicipioDelegacion: '', Colonia: '', TipoVialidad: '',
      NombreVialidad: '', NumeroExterior: '', NumeroInterior: '', CP: '', CorreoElectronico: '', AL: ''
    },
    caracteristicasFiscales: [{ Regimen: '', FechaAlta: '' }]
  });
  const [disableRadioButtons, setDisableRadioButtons] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadStage, setUploadStage] = useState(0);
  const [activeTab, setActiveTab] = useState('identification');

  const handleMediaUpload = async (fileList) => {
    if (fileList.length === 0) return;
    const file = fileList[0];
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/helper/uploadFile`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const mediaUrl = response.data.url;
    if (uploadStage === 0) {
      setProfilePhoto(mediaUrl);
      setUploadStage(1);
    } else {
      setFiles(prevFiles => [...prevFiles, mediaUrl]);
      setUploadStage(uploadStage + 1);
    }
  };
  
  const handleDateInputChange = (e, key) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length > 8) value = value.slice(0, 8); // Limit to 8 digits (YYYYMMDD)

    // Add dashes automatically
    if (value.length > 4) value = value.slice(0, 4) + '-' + value.slice(4);
    if (value.length > 7) value = value.slice(0, 7) + '-' + value.slice(7);

    setClientData(prevData => ({
      ...prevData,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      datosIdentificacion: {
        RFC: clientData.RFC,
        CURP: clientData.CURP,
        Nombre: clientData.Nombre,
        ApellidoPaterno: clientData.ApellidoPaterno,
        ApellidoMaterno: clientData.ApellidoMaterno,
        FechaNacimiento: clientData.FechaNacimiento,
        FechaInicioOperaciones: clientData.FechaInicioOperaciones,
        SituacionContribuyente: clientData.SituacionContribuyente,
        FechaUltimoCambioSituacion: clientData.FechaUltimoCambioSituacion,
        DenominacionRazonSocial: clientData.DenominacionRazonSocial,
        RegimenCapital: clientData.RegimenCapital,
        FechaConstitucion: clientData.FechaConstitucion
      },
      datosUbicacion: clientData.datosUbicacion,
      caracteristicasFiscales: clientData.caracteristicasFiscales,
      profilePhoto,
      files
    };

    if (id) {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/client/updateClient/${id}`, payload, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
    } else {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/client/createClient`, payload, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
    }
    navigate('/clients');
  };

  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };
  
  const handleUploadComplete = (data) => {
    const normalizedEntidad = normalizeText(data.datosUbicacion.EntidadFederativa);
    const bestMatchState = Object.keys(estadosMunicipios).find(state => {
      return normalizeText(state).includes(normalizedEntidad) || normalizedEntidad.includes(normalizeText(state));
    });
  
    const normalizedMunicipio = normalizeText(data.datosUbicacion.MunicipioDelegacion);
    const bestMatchMunicipio = estadosMunicipios[bestMatchState]?.find(municipio => {
      return normalizeText(municipio).includes(normalizedMunicipio) || normalizedMunicipio.includes(normalizeText(municipio));
    });
  
    console.log('Entidad federativa recibida del servidor:', data.datosUbicacion.EntidadFederativa, 'Coincidencia:', bestMatchState);
    console.log('Municipio recibido del servidor:', data.datosUbicacion.MunicipioDelegacion, 'Coincidencia:', bestMatchMunicipio);
  
    const updatedFiscales = data.caracteristicasFiscales.map(fiscal => {
      const normalizedServerRegimen = normalizeText(fiscal.Regimen);
      const matchedRegimen = regimenesFiscales.find(regimen => {
        const normalizedJsonRegimen = normalizeText(regimen.descripcion);
        return normalizedJsonRegimen.includes(normalizedServerRegimen) || normalizedServerRegimen.includes(normalizedJsonRegimen);
      });
  
      if (!matchedRegimen) {
        console.warn('No se encontró coincidencia para el régimen:', fiscal.Regimen);
      }
  
      return { ...fiscal, Regimen: matchedRegimen ? matchedRegimen.descripcion : fiscal.Regimen };
    });
  
    setClientData((prevState) => ({
      ...prevState,
      RFC: data.datosIdentificacion.RFC || prevState.RFC,
      CURP: data.datosIdentificacion.CURP || prevState.CURP,
      Nombre: data.datosIdentificacion.Nombre || prevState.Nombre,
      ApellidoPaterno: data.datosIdentificacion.ApellidoPaterno || prevState.ApellidoPaterno,
      ApellidoMaterno: data.datosIdentificacion.ApellidoMaterno || prevState.ApellidoMaterno,
      FechaNacimiento: data.datosIdentificacion.FechaNacimiento || prevState.FechaNacimiento,
      DenominacionRazonSocial: data.datosIdentificacion.DenominacionRazonSocial || prevState.DenominacionRazonSocial,
      RegimenCapital: data.datosIdentificacion.RegimenCapital || prevState.RegimenCapital,
      FechaConstitucion: data.datosIdentificacion.FechaConstitucion || prevState.FechaConstitucion,
      FechaInicioOperaciones: data.datosIdentificacion.FechaInicioOperaciones || prevState.FechaInicioOperaciones,
      SituacionContribuyente: data.datosIdentificacion.SituacionContribuyente || prevState.SituacionContribuyente,
      FechaUltimoCambioSituacion: data.datosIdentificacion.FechaUltimoCambioSituacion || prevState.FechaUltimoCambioSituacion,
      datosUbicacion: {
        ...prevState.datosUbicacion,
        EntidadFederativa: bestMatchState || prevState.datosUbicacion.EntidadFederativa,
        MunicipioDelegacion: bestMatchMunicipio || prevState.datosUbicacion.MunicipioDelegacion,
        Colonia: data.datosUbicacion.Colonia || prevState.Colonia,
        TipoVialidad: data.datosUbicacion.TipoVialidad || prevState.TipoVialidad,
        NombreVialidad: data.datosUbicacion.NombreVialidad || prevState.NombreVialidad,
        NumeroExterior: data.datosUbicacion.NumeroExterior || prevState.NumeroExterior,
        NumeroInterior: data.datosUbicacion.NumeroInterior || prevState.NumeroInterior,
        CP: data.datosUbicacion.CP || prevState.datosUbicacion.CP,
        CorreoElectronico: data.datosUbicacion.CorreoElectronico || prevState.datosUbicacion.CorreoElectronico,
      },
      caracteristicasFiscales: updatedFiscales
    }));
  
    setClientType(data.datosIdentificacion.CURP ? 'physical' : 'legal');
    setDisableRadioButtons(true);
  };
  


const handleCsfFileUpload = async (fileList) => {
    const file = fileList[0];
    if (!file) return;

    try {
        const data = await extractQrCodeUrl(file);
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/client/csf`, { url: data }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.data) {
            handleUploadComplete(response.data);
        }
    } catch (error) {
        console.error('Error al subir el archivo CSF:', error);
    }
};


  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Nuevo Cliente</h1>
        <CsfUploader onUploadComplete={handleUploadComplete} />
              </div>

      <div className="flex space-x-4 border-b mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'identification' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('identification')}
        >
          Datos De Identificación
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'location' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('location')}
        >
          Datos de Ubicacion
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'fiscal' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('fiscal')}
        >
          Características Fiscales
        </button>
      </div>

      {activeTab === 'identification' && (
        <IdentificationTab
          clientType={clientType}
          setClientType={setClientType}
          clientData={clientData}
          setClientData={setClientData}
          handleDateInputChange={handleDateInputChange}
          disableRadioButtons={disableRadioButtons}
          handleMediaUpload={handleMediaUpload}
          profilePhoto={profilePhoto}
        />
      )}
      {activeTab === 'location' && (
        <LocationTab
          clientData={clientData}
          setClientData={setClientData}
        />
      )}
      {activeTab === 'fiscal' && (
        <FiscalTab
          clientData={clientData}
          setClientData={setClientData}
          handleDateInputChange={handleDateInputChange}
          handleMediaUpload={handleMediaUpload}
          files={files}
        />
      )}
      <div className="flex justify-end mt-6">
      <button 
        type="submit"
        onClick={handleSubmit} 
        className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-300"
      >
        Crear Cliente
      </button>
    </div>
    </div>
  );
};

const IdentificationTab = ({ clientType, setClientType, clientData, setClientData, handleDateInputChange, disableRadioButtons, handleMediaUpload, profilePhoto }) => (
  <div className="grid grid-cols-2 gap-8">
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Subir Foto</label>
        <div className="flex items-center mt-2">
          <span className="inline-block h-24 w-24 rounded-full overflow-hidden bg-gray-100">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <svg className="h-24 w-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 0H0v24h24V0z" fill="none" />
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-10c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm0 14c-4.41 0-8 3.59-8 8h2c0-3.31 2.69-6 6-6s6 2.69 6 6h2c0-4.41-3.59-8-8-8zm-1 7h2v-2h-2v2z" />
              </svg>
            )}
          </span>
          <input type="file" className="hidden" id="uploadPhoto" onChange={(e) => handleMediaUpload(e.target.files)} />
          <label htmlFor="uploadPhoto" className="ml-5 bg-black text-white py-2 px-4 rounded cursor-pointer">Subir Foto</label>
        </div>
      </div>
      {/* Campos comunes para ambos tipos de clientes */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">RFC</label>
        <input type="text" value={clientData.RFC} onChange={(e) => setClientData({ ...clientData, RFC: e.target.value })} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Fecha de Inicio de Operaciones</label>
        <input type="date" value={clientData.FechaInicioOperaciones} onChange={(e) => handleDateInputChange(e, 'FechaInicioOperaciones')} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Fecha del Último Cambio de Situación</label>
        <input type="date" value={clientData.FechaUltimoCambioSituacion} onChange={(e) => handleDateInputChange(e, 'FechaUltimoCambioSituacion')} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Situación del Contribuyente</label>
        <select value={clientData.SituacionContribuyente} onChange={(e) => setClientData({ ...clientData, SituacionContribuyente: e.target.value })} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" required>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
      </div>
    </div>
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tipo de Persona</label>
        <div className="flex space-x-4">
          <div>
            <input type="radio" id="moral" name="tipoPersona" className="mr-2" checked={clientType === 'legal'} onChange={() => setClientType('legal')} disabled={disableRadioButtons} />
            <label htmlFor="moral" className="text-sm font-medium text-gray-700">Persona Moral</label>
          </div>
          <div>
            <input type="radio" id="fisica" name="tipoPersona" className="mr-2" checked={clientType === 'physical'} onChange={() => setClientType('physical')} disabled={disableRadioButtons} />
            <label htmlFor="fisica" className="text-sm font-medium text-gray-700">Persona Física</label>
          </div>
        </div>
      </div>
      {clientType === 'physical' ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">CURP</label>
            <input type="text" value={clientData.CURP} onChange={(e) => setClientData({ ...clientData, CURP: e.target.value })} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" value={clientData.Nombre} onChange={(e) => setClientData({ ...clientData, Nombre: e.target.value })} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
            <input type="text" value={clientData.ApellidoPaterno} onChange={(e) => setClientData({ ...clientData, ApellidoPaterno: e.target.value })} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Apellido Materno</label>
            <input type="text" value={clientData.ApellidoMaterno} onChange={(e) => setClientData({ ...clientData, ApellidoMaterno: e.target.value })} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <input type="date" value={clientData.FechaNacimiento} onChange={(e) => handleDateInputChange(e, 'FechaNacimiento')} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" required />
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Denominación o Razón Social</label>
            <input type="text" value={clientData.DenominacionRazonSocial} onChange={(e) => setClientData({ ...clientData, DenominacionRazonSocial: e.target.value })} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Régimen Capital</label>
            <input type="text" value={clientData.RegimenCapital} onChange={(e) => setClientData({ ...clientData, RegimenCapital: e.target.value })} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha de Constitución</label>
            <input type="date" value={clientData.FechaConstitucion} onChange={(e) => handleDateInputChange(e, 'FechaConstitucion')} className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" />
          </div>
        </>
      )}
    </div>
  </div>
);

const LocationTab = ({ clientData, setClientData }) => (
  <div className="grid grid-cols-2 gap-8">
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Entidad Federativa</label>
        <select
  className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md"
  value={clientData.datosUbicacion.EntidadFederativa}
  onChange={(e) => {
    const selectedState = e.target.value;
    setClientData({ 
      ...clientData, 
      datosUbicacion: { 
        ...clientData.datosUbicacion, 
        EntidadFederativa: selectedState,
        MunicipioDelegacion: '' // Limpia el municipio si cambia la entidad
      } 
    });
  }}
>
  {Object.keys(estadosMunicipios).map(estado => (
    <option key={estado} value={estado}>{estado}</option>
  ))}
</select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Municipio o Delegación</label>
        <select
  className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md"
  value={clientData.datosUbicacion.MunicipioDelegacion}
  onChange={(e) => setClientData({ 
    ...clientData, 
    datosUbicacion: { 
      ...clientData.datosUbicacion, 
      MunicipioDelegacion: e.target.value 
    } 
  })}
>
  {estadosMunicipios[clientData.datosUbicacion.EntidadFederativa]?.map(municipio => (
    <option key={municipio} value={municipio}>{municipio}</option>
  ))}
</select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Colonia</label>
        <input type="text" className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" value={clientData.datosUbicacion.Colonia} onChange={(e) => setClientData({ ...clientData, datosUbicacion: { ...clientData.datosUbicacion, Colonia: e.target.value } })} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Vialidad</label>
        <select 
  className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" 
  value={clientData.datosUbicacion.TipoVialidad} 
  onChange={(e) => setClientData({ ...clientData, datosUbicacion: { ...clientData.datosUbicacion, TipoVialidad: e.target.value } })}
>
  {TipoVialidad.vialidades.map((vialidad) => (
    <option key={vialidad} value={vialidad}>{vialidad}</option>
  ))}
</select>


        <input type="text" className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" placeholder="Nombre de Vialidad" value={clientData.datosUbicacion.NombreVialidad} onChange={(e) => setClientData({ ...clientData, datosUbicacion: { ...clientData.datosUbicacion, NombreVialidad: e.target.value } })} />
      </div>
    </div>
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Número Exterior</label>
        <input type="text" className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" value={clientData.datosUbicacion.NumeroExterior} onChange={(e) => setClientData({ ...clientData, datosUbicacion: { ...clientData.datosUbicacion, NumeroExterior: e.target.value } })} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Número Interior</label>
        <input type="text" className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" value={clientData.datosUbicacion.NumeroInterior} onChange={(e) => setClientData({ ...clientData, datosUbicacion: { ...clientData.datosUbicacion, NumeroInterior: e.target.value } })} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Código Postal</label>
        <input type="text" className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" value={clientData.datosUbicacion.CP} onChange={(e) => setClientData({ ...clientData, datosUbicacion: { ...clientData.datosUbicacion, CP: e.target.value } })} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input type="email" className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" value={clientData.datosUbicacion.CorreoElectronico} onChange={(e) => setClientData({ ...clientData, datosUbicacion: { ...clientData.datosUbicacion, CorreoElectronico: e.target.value } })} />
      </div>
    </div>
  </div>
);

const FiscalTab = ({ clientData, setClientData, handleDateInputChange, handleMediaUpload, files }) => {

  const handleAddFiscal = () => {
    setClientData({
      ...clientData,
      caracteristicasFiscales: [...clientData.caracteristicasFiscales, { Regimen: '', FechaAlta: '' }]
    });
  };

  const handleRemoveFiscal = (index) => {
    if (clientData.caracteristicasFiscales.length > 1) {
      const updatedFiscales = clientData.caracteristicasFiscales.filter((_, i) => i !== index);
      setClientData({ ...clientData, caracteristicasFiscales: updatedFiscales });
    }
  };

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    handleMediaUpload(fileList);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {clientData.caracteristicasFiscales.map((fiscal, index) => (
        <React.Fragment key={index}>
          <div className="mb-4 flex items-center">
            <PlusCircleIcon
              className="h-6 w-6 text-green-500 mr-2 cursor-pointer"
              onClick={handleAddFiscal}
            />
            <select
              className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md"
              value={fiscal.Regimen}
              onChange={(e) => {
                const selectedRegimen = regimenesFiscales.find(regimen => regimen.descripcion === e.target.value);
                const updatedFiscales = [...clientData.caracteristicasFiscales];
                updatedFiscales[index].Regimen = selectedRegimen.descripcion;
                setClientData({ ...clientData, caracteristicasFiscales: updatedFiscales });
              }}
            >
              {regimenesFiscales.map(regimen => (
                <option key={regimen.id} value={regimen.descripcion}>{regimen.descripcion}</option>
              ))}
            </select>
            <MinusCircleIcon
              className={`h-6 w-6 text-red-500 ml-2 cursor-pointer ${clientData.caracteristicasFiscales.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleRemoveFiscal(index)}
            />
          </div>
          <div className="mb-4">
            <input type="date" className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md" value={fiscal.FechaAlta} onChange={(e) => handleDateInputChange(e, `caracteristicasFiscales[${index}].FechaAlta`)} />
          </div>
        </React.Fragment>
      ))}

      {/* File Upload Section */}
<div className="col-span-2 mt-4">
  <div className="flex items-center">
    <input
      type="file"
      className="hidden"
      id="fileInput"
      onChange={handleFileChange}
      multiple
    />
    <button
      className="bg-black text-white py-2 px-4 rounded cursor-pointer"
      onClick={() => document.getElementById('fileInput').click()}
    >
      Agregar archivos
    </button>
  </div>
  <div className="mt-4 p-4 border rounded-md bg-gray-50">
    <h2 className="text-lg font-medium">Archivos Subidos</h2>
    <ul className="list-disc list-inside">
      {files.map((fileUrl, index) => (
        <li key={index}>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {fileUrl.split('/').pop()} {/* Display filename */}
          </a>
        </li>
      ))}
    </ul>
  </div>
</div>
</div>

  );
};


export default ClientForm;
