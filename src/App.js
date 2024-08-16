import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import BlogList from './components/BlogList';
import BlogEditor from './components/BlogEditor';
import ClientEditor from './components/ClientEditor';
import ClientList from './components/ClientList';
import ClientDetails from './components/ClientDetails'; 
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import Orders from './components/OrderManagement';
import './App.css'; 

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        const expiryTime = localStorage.getItem('tokenExpiry');
        if (token && expiryTime && new Date().getTime() < expiryTime) {
            return true;
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            return false;
        }
    };
  
    return (
        <Router>
            {isAuthenticated() && <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} username="Usuario" />}
            <div className={`app-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                {isAuthenticated() && (
                    <button className="hamburger-icon" onClick={toggleSidebar}>
                        &#9776; {/* Este es el ícono de hamburguesa */}
                    </button>
                )}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/blog" element={isAuthenticated() ? <BlogList /> : <Navigate to="/login" />} />
                    <Route path="/blogedit/:id?" element={isAuthenticated() ? <BlogEditor /> : <Navigate to="/login" />} />
                    <Route path="/clients" element={isAuthenticated() ? <ClientList /> : <Navigate to="/login" />} />
                    <Route path="/clientedit/:id?" element={isAuthenticated() ? <ClientEditor /> : <Navigate to="/login" />} />
                    <Route path="/client/:id" element={isAuthenticated() ? <ClientDetails /> : <Navigate to="/login" />} /> 
                    <Route path="/orders" element={isAuthenticated() ? <Orders /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to={isAuthenticated() ? "/home" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
