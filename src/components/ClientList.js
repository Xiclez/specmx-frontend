import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientCard from './ClientCard';
import { useNavigate } from 'react-router-dom';
import './ClientList.css';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();

    const fetchClients = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/client/getClients`);
        setClients(response.data);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleViewClient = (client) => {
        navigate(`/client/${client._id}`);
    };

    const handleEditClient = (client) => {
        navigate(`/clientedit/${client._id}`);
    };

    const handleDeleteClient = async (id) => {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/client/deleteClient/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setClients(clients.filter(client => client._id !== id));
    };

    return (
        <div className="client-list-container">
            <h2>Client List</h2>
            <button onClick={() => navigate('/clientedit')}>Create New Client</button>
            <div className="client-cards-container">
                {clients.map(client => (
                    <ClientCard 
                        key={client._id} 
                        client={client} 
                        onView={handleViewClient} 
                        onEdit={handleEditClient} 
                        onDelete={handleDeleteClient} 
                    />
                ))}
            </div>
        </div>
    );
};

export default ClientList;
