import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientDetails.css';

const ClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);

    const fetchClientDetails = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/client/getClient/${id}`);
        setClient(response.data);
    };

    useEffect(() => {
        fetchClientDetails();
    }, [id]);

    if (!client) return <div>Loading...</div>;

    return (
        <div className="client-details-container">
            <h2>Client Details</h2>
            <div className="client-details-section">
                <h3>Identification Details</h3>
                <p><strong>CURP:</strong> {client.datosIdentificacion.CURP}</p>
                <p><strong>Nombre:</strong> {client.datosIdentificacion.Nombre}</p>
                <p><strong>Apellido Paterno:</strong> {client.datosIdentificacion.ApellidoPaterno}</p>
                <p><strong>Apellido Materno:</strong> {client.datosIdentificacion.ApellidoMaterno}</p>
                <p><strong>Fecha de Nacimiento:</strong> {client.datosIdentificacion.FechaNacimiento}</p>
                <p><strong>Fecha de Inicio de Operaciones:</strong> {client.datosIdentificacion.FechaInicioOperaciones}</p>
                <p><strong>Situación del Contribuyente:</strong> {client.datosIdentificacion.SituacionContribuyente}</p>
                <p><strong>Fecha del Último Cambio de Situación:</strong> {client.datosIdentificacion.FechaUltimoCambioSituacion}</p>
                <p><strong>Denominación o Razón Social:</strong> {client.datosIdentificacion.DenominacionRazonSocial}</p>
                <p><strong>Régimen Capital:</strong> {client.datosIdentificacion.RegimenCapital}</p>
                <p><strong>Fecha de Constitución:</strong> {client.datosIdentificacion.FechaConstitucion}</p>
            </div>
            <div className="client-details-section">
                <h3>Location Details</h3>
                <p><strong>Entidad Federativa:</strong> {client.datosUbicacion.EntidadFederativa}</p>
                <p><strong>Municipio/Delegación:</strong> {client.datosUbicacion.MunicipioDelegacion}</p>
                <p><strong>Colonia:</strong> {client.datosUbicacion.Colonia}</p>
                <p><strong>Tipo de Vialidad:</strong> {client.datosUbicacion.TipoVialidad}</p>
                <p><strong>Nombre de Vialidad:</strong> {client.datosUbicacion.NombreVialidad}</p>
                <p><strong>Número Exterior:</strong> {client.datosUbicacion.NumeroExterior}</p>
                <p><strong>Número Interior:</strong> {client.datosUbicacion.NumeroInterior}</p>
                <p><strong>Código Postal:</strong> {client.datosUbicacion.CP}</p>
                <p><strong>Correo Electrónico:</strong> {client.datosUbicacion.CorreoElectronico}</p>
                <p><strong>AL:</strong> {client.datosUbicacion.AL}</p>
            </div>
            <div className="client-details-section">
                <h3>Fiscal Characteristics</h3>
                {client.caracteristicasFiscales.map((fiscal, index) => (
                    <div key={index}>
                        <p><strong>Régimen:</strong> {fiscal.Regimen}</p>
                        <p><strong>Fecha de Alta:</strong> {fiscal.FechaAlta}</p>
                    </div>
                ))}
            </div>
            <div className="client-details-section">
                <h3>Profile Photo</h3>
                {client.profilePhoto ? (
                    <img src={client.profilePhoto} alt="Profile" />
                ) : (
                    <p>No profile photo available</p>
                )}
            </div>
            <div className="client-details-section">
                <h3>Files</h3>
                {client.files.length > 0 ? (
                    client.files.map((file, index) => (
                        <div key={index}>
                            <a href={file} target="_blank" rel="noopener noreferrer">File {index + 1}</a>
                        </div>
                    ))
                ) : (
                    <p>No files available</p>
                )}
            </div>
            <button onClick={() => navigate('/clientlist')}>Back to Client List</button>
        </div>
    );
};

export default ClientDetails;
