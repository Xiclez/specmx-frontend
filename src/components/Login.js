import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Estilos específicos para el componente de login

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Evitar recarga de la página
        setError(''); // Limpiar errores previos

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
            const token = response.data.token;

            if (token) {
                localStorage.setItem('token', token);
                console.log('Token stored:', token); // Verificar si el token se almacena correctamente
                
                // Establecer un tiempo de expiración del token (opcional)
                const expiryTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutos
                localStorage.setItem('tokenExpiry', expiryTime);
                
                // Redirigir al usuario a la página de inicio
                navigate('/home');
            } else {
                setError('Login failed: No token received.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
