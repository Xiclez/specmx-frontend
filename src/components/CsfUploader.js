import React, { useState } from 'react';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import jsQR from 'jsqr';

// Set the workerSrc property for pdfjsLib
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

export const extractQrCodeUrl = async (file) => {
    try {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        const quadrants = [
            { x: 0, y: 0, width: canvas.width / 2, height: canvas.height / 2 },
            { x: canvas.width / 2, y: 0, width: canvas.width / 2, height: canvas.height / 2 },
            { x: 0, y: canvas.height / 2, width: canvas.width / 2, height: canvas.height / 2 },
            { x: canvas.width / 2, y: canvas.height / 2, width: canvas.width / 2, height: canvas.height / 2 }
        ];

        for (const quadrant of quadrants) {
            const croppedData = context.getImageData(
                quadrant.x, quadrant.y,
                quadrant.width, quadrant.height
            );

            const qrCode = jsQR(croppedData.data, quadrant.width, quadrant.height);

            if (qrCode) {
                return qrCode.data;
            }
        }

        throw new Error('No se encontró ningún código QR en la primera página.');
    } catch (error) {
        console.error('Error al extraer la URL del QR:', error);
        throw error;
    }
};

const CsfUploader = ({ onUploadComplete }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = async (fileList) => {
        const file = fileList[0];
        setLoading(true);
        setError(null);
        try {
            let data;
            let complete = false;

            while (!complete) {
                const pdfUrl = await extractQrCodeUrl(file);
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/client/csf`, { url: pdfUrl }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                data = response.data;

                // Verificar si los campos están completos
                if (
                    (!data.Nombre && !data.ApellidoPaterno && !data.EntidadFederativa) && // Si estos están vacíos, verificar los siguientes
                    (!data.DenominacionRazonSocial || !data.RegimenCapital || !data.FechaConstitucion) || // Si también están vacíos, es un error
                    !data.MunicipioDelegacion || !data.Colonia || !data.NombreVialidad || 
                    !data.NumeroExterior || !data.CP || !data.RFC
                ) {
                    setError('Datos incompletos recibidos, reintentando...');
                } else {
                    complete = true;
                    setError(null);
                    onUploadComplete(data);
                }
            }      
        } catch (error) {
            setError('Error scanning PDF: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center">
            <button
                className="bg-black text-white py-2 px-4 rounded"
                onClick={() => document.getElementById('csfFileInput').click()}
            >
                {loading ? 'Subiendo...' : 'Subir CSF'}
            </button>
            <input
                type="file"
                accept="application/pdf"
                id="csfFileInput"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
            />
{loading && (
    <div className="flex items-center">
        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span className="text-white">Processing...</span>
    </div>
)}
        </div>
    );
    
};

export default CsfUploader;