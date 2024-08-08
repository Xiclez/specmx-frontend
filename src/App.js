import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import BlogList from './components/BlogList';
import BlogEditor from './components/BlogEditor';
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
                <Route path="/editor/:id?" element={isAuthenticated() ? <BlogEditor /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to={isAuthenticated() ? "/blog" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;
