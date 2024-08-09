import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ClientEditor.css';
import * as pdfjsLib from 'pdfjs-dist';
import jsQR from 'jsqr';

// Set the workerSrc property for pdfjsLib
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

// Function to extract QR code URL from the first page of the PDF
export const extractQrCodeUrl = async (file) => {
    try {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;

        // Get the first page
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        // Prepare a canvas element
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render the page into the canvas context
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        // Define quadrants
        const quadrants = [
            { x: 0, y: 0, width: canvas.width / 2, height: canvas.height / 2 }, // Top-left
            { x: canvas.width / 2, y: 0, width: canvas.width / 2, height: canvas.height / 2 }, // Top-right
            { x: 0, y: canvas.height / 2, width: canvas.width / 2, height: canvas.height / 2 }, // Bottom-left
            { x: canvas.width / 2, y: canvas.height / 2, width: canvas.width / 2, height: canvas.height / 2 } // Bottom-right
        ];

        // Scan each quadrant for a QR code
        for (const quadrant of quadrants) {
            const croppedData = context.getImageData(
                quadrant.x, quadrant.y,
                quadrant.width, quadrant.height
            );

            // Scan the cropped image for a QR code
            const qrCode = jsQR(croppedData.data, quadrant.width, quadrant.height);

            if (qrCode) {
                return qrCode.data; // Return the URL found in the QR code
            }
        }

        throw new Error('No se encontró ningún código QR en la primera página.');
    } catch (error) {
        console.error('Error al extraer la URL del QR:', error);
        throw error;
    }
};

const ClientEditor = ({ onSave }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [clientType, setClientType] = useState('physical'); // 'physical' or 'legal'
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

    useEffect(() => {
        if (id) {
            const fetchClient = async () => {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/client/${id}`);
                setClientData(response.data);
                setClientType(response.data.CURP ? 'physical' : 'legal');
            };
            fetchClient();
        }
    }, [id]);

    const handleFileUpload = async (fileList) => {
        const file = fileList[0];
        try {
            const pdfUrl = await extractQrCodeUrl(file);
            const scannedData = await axios.post(`${process.env.REACT_APP_API_URL}/api/client/csf`, { url: pdfUrl }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setClientData(scannedData.data);
        } catch (error) {
            console.error('Error scanning PDF:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (id) {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/client/updateClient/${id}`, clientData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        } else {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/client/createClient`, clientData, {
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
                    /> Physical
                    <input
                        type="radio"
                        checked={clientType === 'legal'}
                        onChange={() => setClientType('legal')}
                    /> Legal
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
                                type="date"
                                value={clientData.FechaNacimiento}
                                onChange={(e) => setClientData({ ...clientData, FechaNacimiento: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Fecha de Inicio de Operaciones:</label>
                            <input
                                type="date"
                                value={clientData.FechaInicioOperaciones}
                                onChange={(e) => setClientData({ ...clientData, FechaInicioOperaciones: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Situación del Contribuyente:</label>
                            <input
                                type="text"
                                value={clientData.SituacionContribuyente}
                                onChange={(e) => setClientData({ ...clientData, SituacionContribuyente: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Fecha del Último Cambio de Situación:</label>
                            <input
                                type="date"
                                value={clientData.FechaUltimoCambioSituacion}
                                onChange={(e) => setClientData({ ...clientData, FechaUltimoCambioSituacion: e.target.value })}
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
                                type="date"
                                value={clientData.FechaConstitucion}
                                onChange={(e) => setClientData({ ...clientData, FechaConstitucion: e.target.value })}
                                required
                            />
                        </div>
                    </>
                )}

                {/* Datos de Ubicación */}
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

                {/* Características Fiscales */}
                <div>
                    <label>Características Fiscales:</label>
                    {clientData.caracteristicasFiscales.map((fiscal, index) => (
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
                                type="date"
                                value={fiscal.FechaAlta || ''}
                                onChange={(e) => {
                                    const updatedFiscales = [...clientData.caracteristicasFiscales];
                                    updatedFiscales[index].FechaAlta = e.target.value;
                                    setClientData({ ...clientData, caracteristicasFiscales: updatedFiscales });
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div>
                    <label>Archivos de PDF:</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload(e.target.files)}
                    />
                </div>

                <button type="submit">Save Client</button>
            </form>
        </div>
    );
};

export default ClientEditor;
