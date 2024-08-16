import React, { useState, useEffect } from 'react';

const ClientList = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/client/getClients`)
            .then(response => response.json())
            .then(data => setClients(data))
            .catch(error => console.error('Error fetching client data:', error));
    }, []);

    const getNombreRazonSocial = (identificacion) => {
        if (identificacion.Nombre && identificacion.ApellidoPaterno) {
            return `${identificacion.Nombre} ${identificacion.ApellidoPaterno}`;
        }
        return `${identificacion.DenominacionRazonSocial} ${identificacion.RegimenCapital}`;
    };

    const getRegimen = (regimenes) => {
        if (regimenes.length > 1) {
            return (
                <div className="regimen-dropdown">
                    {regimenes[0].Regimen}
                    <span className="plus-icon">+</span>
                    <div className="regimen-list">
                        {regimenes.map((r, index) => (
                            <div key={index} className="regimen-item">{r.Regimen}</div>
                        ))}
                    </div>
                </div>
            );
        }
        return regimenes[0].Regimen;
    };

    return (
        <div className="client-list">
            <div className="header">
                <h2>Clientes</h2>
                <button className="create-client">Crear Cliente</button>
            </div>
            <table className="client-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>ID de Cliente</th>
                        <th>Nombre/Razon Social</th>
                        <th>Ordenes Activas</th>
                        <th>Regimen</th>
                        <th>RFC</th>
                        <th>Código Postal</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client, index) => (
                        <tr key={client._id}>
                            <td>{index + 1}</td>
                            <td>{client._id}</td>
                            <td>{getNombreRazonSocial(client.datosIdentificacion)}</td>
                            <td className="pending">Pendiente</td>
                            <td>{getRegimen(client.caracteristicasFiscales)}</td>
                            <td className="pending">Pendiente</td>
                            <td>{client.datosUbicacion.CP}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientList;
