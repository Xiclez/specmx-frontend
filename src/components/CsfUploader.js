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
                if (!data.datosIdentificacion || Object.keys(data.datosIdentificacion).length === 0 ||
                    !data.datosUbicacion || Object.keys(data.datosUbicacion).length === 0 ||
                    !data.caracteristicasFiscales || data.caracteristicasFiscales.length === 0) {
                    setError('Incomplete data received, retrying...');
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
        <div>
            <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e.target.files)} />
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CsfUploader;
