import React from 'react';
import './ClientCard.css';  

const ClientCard = ({ client, onView, onEdit, onDelete }) => {
    return (
        <div className="client-card">
            <h3>{client.datosIdentificacion.Nombre || client.datosIdentificacion.DenominacionRazonSocial}</h3>
            <p><strong>Entidad Federativa:</strong> {client.datosUbicacion.EntidadFederativa}</p>
            <p><strong>Municipio/Delegación:</strong> {client.datosUbicacion.MunicipioDelegacion}</p>
            <button onClick={() => onView(client)}>View</button>
            <button onClick={() => onEdit(client)}>Edit</button>
            <button onClick={() => onDelete(client._id)}>Delete</button>
        </div>
    );
};

export default ClientCard;
