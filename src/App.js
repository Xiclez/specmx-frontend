import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Loginn';
import BlogList from './components/BlogList';
import BlogEditor from './components/BlogEditor';
import ClientEditor from './components/ClientForm';
import ClientList from './components/ClientTable';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import Orders from './components/OrderManagement';
import Topbar from './components/Topbar'; // Importa el componente Topbar
import './App.css'; 

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const checkAuthentication = () => {
        const token = localStorage.getItem('token');
        const expiryTime = localStorage.getItem('tokenExpiry');
        if (token && expiryTime && new Date().getTime() < expiryTime) {
            setIsAuth(true);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            setIsAuth(false);
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <Router>
            <AuthenticatedApp isAuth={isAuth} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </Router>
    );
};

const AuthenticatedApp = ({ isAuth, sidebarOpen, toggleSidebar }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <>
            {!isLoginPage && isAuth && <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} username="Usuario" />}
            <div className={`app-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                {!isLoginPage && isAuth && (
                    <>
                        <Topbar /> {/* Renderizar Topbar si no es la página de login y el usuario está autenticado */}
                        <button className="hamburger-icon" onClick={toggleSidebar}>
                            &#9776; {/* Este es el ícono de hamburguesa */}
                        </button>
                    </>
                )}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={isAuth ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/clients" element={isAuth ? <ClientList /> : <Navigate to="/login" />} />
                    <Route path="/client/create" element={isAuth ? <ClientEditor mode="create" /> : <Navigate to="/login" />} />
                    <Route path="/client/edit/:id" element={isAuth ? <ClientEditor mode="edit" /> : <Navigate to="/login" />} />
                    <Route path="/client/view/:id" element={isAuth ? <ClientEditor mode="view" /> : <Navigate to="/login" />} />
                    <Route path="/blog" element={isAuth ? <BlogList /> : <Navigate to="/login" />} />
                    <Route path="/blogedit/:id?" element={isAuth ? <BlogEditor /> : <Navigate to="/login" />} />
                    <Route path="/orders" element={isAuth ? <Orders /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to={isAuth ? "/home" : "/login"} />} />
                </Routes>
            </div>
        </>
    );
};

export default App;
