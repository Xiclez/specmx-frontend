import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import BlogList from './components/BlogList';
import BlogEditor from './components/BlogEditor';
import ClientEditor from './components/ClientEditor';
import ClientList from './components/ClientList';
import ClientDetails from './components/ClientDetails'; // Importar el componente ClientDetails
import './App.css'; // Estilos generales

const App = () => {
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        console.log('Checking token:', token); // Verificar si el token está presente
        return !!token;
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/blog" element={isAuthenticated() ? <BlogList /> : <Navigate to="/login" />} />
                <Route path="/blogedit/:id?" element={isAuthenticated() ? <BlogEditor /> : <Navigate to="/login" />} />
                <Route path="/clients" element={isAuthenticated() ? <ClientList /> : <Navigate to="/login" />} />
                <Route path="/clientedit/:id?" element={isAuthenticated() ? <ClientEditor /> : <Navigate to="/login" />} />
                <Route path="/client/:id" element={isAuthenticated() ? <ClientDetails /> : <Navigate to="/login" />} /> 
                <Route path="/" element={<Navigate to={isAuthenticated() ? "/blog" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;
