import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CsfUploader from './CsfUploader';

const ClientEditor = ({ onSave }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [clientType, setClientType] = useState('physical');
    const [clientData, setClientData] = useState({
        CURP: '', Nombre: '', ApellidoPaterno: '', ApellidoMaterno: '', FechaNacimiento: '',
        FechaInicioOperaciones: '', SituacionContribuyente: '', FechaUltimoCambioSituacion: '',
        DenominacionRazonSocial: '', RegimenCapital: '', FechaConstitucion: '',
        datosUbicacion: {
            EntidadFederativa: '', MunicipioDelegacion: '', Colonia: '', TipoVialidad: '',
            NombreVialidad: '', NumeroExterior: '', NumeroInterior: '', CP: '', CorreoElectronico: '', AL: ''
        },
        caracteristicasFiscales: []
    });
    const [disableRadioButtons, setDisableRadioButtons] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(''); // Estado para la foto de perfil
    const [files, setFiles] = useState([]); // Estado para los archivos adicionales
    const [uploadStage, setUploadStage] = useState(0); // Para manejar la secuencia de carga de archivos

    // Modifica la carga de datos cuando se obtienen los datos del cliente
    useEffect(() => {
        if (id) {
            const fetchClient = async () => {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/client/getClient/${id}`);
                const client = response.data;
                setClientData({
                    CURP: client.datosIdentificacion.CURP || '',
                    Nombre: client.datosIdentificacion.Nombre || '',
                    ApellidoPaterno: client.datosIdentificacion.ApellidoPaterno || '',
                    ApellidoMaterno: client.datosIdentificacion.ApellidoMaterno || '',
                    FechaNacimiento: client.datosIdentificacion.FechaNacimiento || '',
                    DenominacionRazonSocial: client.datosIdentificacion.DenominacionRazonSocial || '',
                    RegimenCapital: client.datosIdentificacion.RegimenCapital || '',
                    FechaConstitucion: client.datosIdentificacion.FechaConstitucion || '',
                    FechaInicioOperaciones: client.datosIdentificacion.FechaInicioOperaciones || '',
                    SituacionContribuyente: client.datosIdentificacion.SituacionContribuyente || '',
                    FechaUltimoCambioSituacion: client.datosIdentificacion.FechaUltimoCambioSituacion || '',
                    datosUbicacion: {
                        ...client.datosUbicacion
                    },
                    caracteristicasFiscales: client.caracteristicasFiscales.map(fiscal => ({
                        ...fiscal,
                        FechaAlta: fiscal.FechaAlta || ''
                    }))
                });
                setProfilePhoto(client.profilePhoto || '');
                setFiles(client.files || []);
                setClientType(client.datosIdentificacion.CURP ? 'physical' : 'legal');
            };

            fetchClient();
        }
    }, [id]);

    const handleUploadComplete = (data) => {
        const { CURP, Nombre, ApellidoPaterno, ApellidoMaterno, FechaNacimiento, DenominacionRazonSocial, RegimenCapital, FechaConstitucion } = data.datosIdentificacion;
    
        setClientData((prevState) => ({
            ...prevState,
            CURP: CURP || prevState.CURP,
            Nombre: Nombre || prevState.Nombre,
            ApellidoPaterno: ApellidoPaterno || prevState.ApellidoPaterno,
            ApellidoMaterno: ApellidoMaterno || prevState.ApellidoMaterno,
            FechaNacimiento: FechaNacimiento || prevState.FechaNacimiento,
            DenominacionRazonSocial: DenominacionRazonSocial || prevState.DenominacionRazonSocial,
            RegimenCapital: RegimenCapital || prevState.RegimenCapital,
            FechaConstitucion: FechaConstitucion || prevState.FechaConstitucion,
            FechaInicioOperaciones: data.datosIdentificacion.FechaInicioOperaciones || prevState.FechaInicioOperaciones,
            SituacionContribuyente: data.datosIdentificacion.SituacionContribuyente || prevState.SituacionContribuyente,
            FechaUltimoCambioSituacion: data.datosIdentificacion.FechaUltimoCambioSituacion || prevState.FechaUltimoCambioSituacion,
            datosUbicacion: {
                ...prevState.datosUbicacion,
                ...data.datosUbicacion
            },
            caracteristicasFiscales: data.caracteristicasFiscales.map(fiscal => ({
                ...fiscal,
                FechaAlta: fiscal.FechaAlta || ''
            }))
        }));
    
        setClientType(CURP ? 'physical' : 'legal');
        setDisableRadioButtons(true);
    };

    const handleImageUpload = async (fileList) => {
        const file = fileList[0];
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/helper/uploadFile`, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const imageUrl = response.data.url;
        if (uploadStage === 0) {
            setProfilePhoto(imageUrl); // Guardar la URL de la foto de perfil
            setUploadStage(1);
        } else {
            setFiles(prevFiles => [...prevFiles, imageUrl]); // Agregar archivos adicionales
            setUploadStage(uploadStage + 1);
        }
    };

    const handleDateInputChange = (e, key) => {
        let value = e.target.value.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
        if (value.length > 8) value = value.slice(0, 8); // Limita a 8 dígitos (YYYYMMDD)
        
        // Agrega los guiones automáticamente
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
            profilePhoto,  // Añadir la foto de perfil
            files  // Añadir los archivos
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

    return (
        <div className="client-editor-container">
            <h2>{id ? 'Edit Client' : 'Create Client'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Client Type:</label>
                    <input
                        type="radio"
                        checked={clientType === 'physical'}
                        onChange={() => setClientType('physical')}
                        disabled={disableRadioButtons}
                    /> Physical
                    <input
                        type="radio"
                        checked={clientType === 'legal'}
                        onChange={() => setClientType('legal')}
                        disabled={disableRadioButtons}
                    /> Legal
                </div>

                {/* Campos comunes para ambos tipos de clientes */}
                <div>
                    <label>Fecha de Inicio de Operaciones:</label>
                    <input
                        type="text"
                        value={clientData.FechaInicioOperaciones}
                        onChange={(e) => handleDateInputChange(e, 'FechaInicioOperaciones')}
                        placeholder="YYYY-MM-DD"
                        maxLength="10"
                        pattern="\d{4}-\d{2}-\d{2}"
                        required
                    />
                </div>
                <div>
                    <label>Situación del Contribuyente:</label>
                    <select
                        value={clientData.SituacionContribuyente}
                        onChange={(e) => setClientData({ ...clientData, SituacionContribuyente: e.target.value })}
                        required
                    >
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="INACTIVO">INACTIVO</option>
                    </select>
                </div>
                <div>
                    <label>Fecha del Último Cambio de Situación:</label>
                    <input
                        type="text"
                        value={clientData.FechaUltimoCambioSituacion}
                        onChange={(e) => handleDateInputChange(e, 'FechaUltimoCambioSituacion')}
                        placeholder="YYYY-MM-DD"
                        maxLength="10"
                        pattern="\d{4}-\d{2}-\d{2}"
                        required
                    />
                </div>

                {clientType === 'physical' ? (
                    <>
                        <div>
                            <label>CURP:</label>
                            <input
                                type="text"
                                value={clientData.CURP}
                                onChange={(e) => setClientData({ ...clientData, CURP: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={clientData.Nombre}
                                onChange={(e) => setClientData({ ...clientData, Nombre: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Apellido Paterno:</label>
                            <input
                                type="text"
                                value={clientData.ApellidoPaterno}
                                onChange={(e) => setClientData({ ...clientData, ApellidoPaterno: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Apellido Materno:</label>
                            <input
                                type="text"
                                value={clientData.ApellidoMaterno}
                                onChange={(e) => setClientData({ ...clientData, ApellidoMaterno: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Fecha de Nacimiento:</label>
                            <input
                                type="text"
                                value={clientData.FechaNacimiento}
                                onChange={(e) => handleDateInputChange(e, 'FechaNacimiento')}
                                placeholder="YYYY-MM-DD"
                                maxLength="10"
                                pattern="\d{4}-\d{2}-\d{2}"
                                required
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label>Denominación o Razón Social:</label>
                            <input
                                type="text"
                                value={clientData.DenominacionRazonSocial}
                                onChange={(e) => setClientData({ ...clientData, DenominacionRazonSocial: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Régimen Capital:</label>
                            <input
                                type="text"
                                value={clientData.RegimenCapital}
                                onChange={(e) => setClientData({ ...clientData, RegimenCapital: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Fecha de Constitución:</label>
                            <input
                                type="text"
                                value={clientData.FechaConstitucion}
                                onChange={(e) => handleDateInputChange(e, 'FechaConstitucion')}
                                placeholder="YYYY-MM-DD"
                                maxLength="10"
                                pattern="\d{4}-\d{2}-\d{2}"
                            />
                        </div>
                    </>
                )}

                {/* Datos de Ubicación y Características Fiscales */}
                <div>
                    <label>Entidad Federativa:</label>
                    <input
                        type="text"
                        value={clientData.datosUbicacion.EntidadFederativa}
                        onChange={(e) => setClientData({
                            ...clientData,
                            datosUbicacion: { ...clientData.datosUbicacion, EntidadFederativa: e.target.value }
                        })}
                        required
                    />
                </div>
                <div>
                    <label>Municipio o Delegación:</label>
                    <input
                        type="text"
                        value={clientData.datosUbicacion.MunicipioDelegacion}
                        onChange={(e) => setClientData({
                            ...clientData,
                            datosUbicacion: { ...clientData.datosUbicacion, MunicipioDelegacion: e.target.value }
                        })}
                        required
                    />
                </div>
                <div>
                    <label>Colonia:</label>
                    <input
                        type="text"
                        value={clientData.datosUbicacion.Colonia}
                        onChange={(e) => setClientData({
                            ...clientData,
                            datosUbicacion: { ...clientData.datosUbicacion, Colonia: e.target.value }
                        })}
                        required
                    />
                </div>
                <div>
                    <label>Tipo de Vialidad:</label>
                    <input
                        type="text"
                        value={clientData.datosUbicacion.TipoVialidad}
                        onChange={(e) => setClientData({
                            ...clientData,
                            datosUbicacion: { ...clientData.datosUbicacion, TipoVialidad: e.target.value }
                        })}
                        required
                    />
                </div>
                <div>
                    <label>Nombre de Vialidad:</label>
                    <input
                        type="text"
                        value={clientData.datosUbicacion.NombreVialidad}
                        onChange={(e) => setClientData({
                            ...clientData,
                            datosUbicacion: { ...clientData.datosUbicacion, NombreVialidad: e.target.value }
                        })}
                        required
                    />
                </div>
                <div>
                    <label>Número Exterior:</label>
                    <input
                        type="text"
                        value={clientData.datosUbicacion.NumeroExterior}
                        onChange={(e) => setClientData({
                            ...clientData,
                            datosUbicacion: { ...clientData.datosUbicacion, NumeroExterior: e.target.value }
                        })}
                        required
                    />
                </div>
                <div>
                    <label>Número Interior:</label>
                    <input
                        type="text"
                        value={clientData.datosUbicacion.NumeroInterior}
                        onChange={(e) => setClientData({
                            ...clientData,
                            datosUbicacion: { ...clientData.datosUbicacion, NumeroInterior: e.target.value }
                        })}
                    />
                </div>
                <div>
                    <label>Código Postal:</label>
                    <input
                        type="text"
                        value={clientData.datosUbicacion.CP}
                        onChange={(e) => setClientData({
                            ...clientData,
                            datosUbicacion: { ...clientData.datosUbicacion, CP: e.target.value }
                        })}
                        required
                    />
                </div>
                <div>
                    <label>Correo Electrónico:</label>
                    <input
                        type="email"
                        value={clientData.datosUbicacion.CorreoElectronico}
                        onChange={(e) => setClientData({
                            ...clientData,
                            datosUbicacion: { ...clientData.datosUbicacion, CorreoElectronico: e.target.value }
                        })}
                        required
                    />
                </div>

                <div>
                    <label>Características Fiscales:</label>
                    {clientData.caracteristicasFiscales.map((fiscal, index) => (
                        fiscal.Regimen && fiscal.FechaAlta ? (
                            <div key={index}>
                                <input
                                    type="text"
                                    value={fiscal.Regimen}
                                    onChange={(e) => {
                                        const updatedFiscales = [...clientData.caracteristicasFiscales];
                                        updatedFiscales[index].Regimen = e.target.value;
                                        setClientData({ ...clientData, caracteristicasFiscales: updatedFiscales });
                                    }}
                                    required
                                />
                                <input
                                    type="text"
                                    value={fiscal.FechaAlta}
                                    onChange={(e) => handleDateInputChange(e, `caracteristicasFiscales[${index}].FechaAlta`)}
                                    placeholder="YYYY-MM-DD"
                                    maxLength="10"
                                    pattern="\d{4}-\d{2}-\d{2}"
                                />
                            </div>
                        ) : null
                    ))}
                </div>

                <CsfUploader onUploadComplete={handleUploadComplete} />

                <div>
                    <label>Upload Profile Photo:</label>
                    <input type="file" onChange={(e) => handleImageUpload(e.target.files)} />
                </div>
                <div>
                    <label>Profile Photo URL:</label>
                    <input type="text" value={profilePhoto} readOnly />
                </div>

                <div>
                    <label>Upload Files:</label>
                    <input type="file" onChange={(e) => handleImageUpload(e.target.files)} />
                </div>
                <div>
                    {files.map((file, index) => (
                        <div key={index}>
                            <label>File {index + 1} URL:</label>
                            <input type="text" value={file} readOnly />
                        </div>
                    ))}
                </div>

                <button type="submit">Save Client</button>
            </form>
        </div>
    );
};

export default ClientEditor;
