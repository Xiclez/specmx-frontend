import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import BlogManager from './components/BlogManager';
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
                <Route path="/blog" element={isAuthenticated() ? <BlogManager /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
