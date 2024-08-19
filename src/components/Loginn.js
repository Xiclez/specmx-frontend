import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import specLogo from '../assets/SPECMX2.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent page reload
        setError(''); // Clear previous errors

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
            const token = response.data.token;

            if (token) {
                localStorage.setItem('token', token);
                console.log('Token stored:', token); // Verify if the token is stored correctly
                
                // Set token expiration time (optional)
                const expiryTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes
                localStorage.setItem('tokenExpiry', expiryTime);
                
                console.log('Navigating to /home');
                navigate('/home'); // Redirect the user to the homepage
            } else {
                setError('Login failed: No token received.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="flex justify-center items-center">
                        <div className="bg-black-500 h-10 w-10 rounded-full flex items-center justify-center">
                            <img src={specLogo} alt="SPECMX Logo" className="h-8 w-8" />
                        </div>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-blue-700">SPECMX</h2>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600"
                            id="email"
                            type="email"
                            placeholder="usuario@specmx.net"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600"
                            id="password"
                            type="password"
                            placeholder="**********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <a className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800" href="#">
                            ¿Olvidó su contraseña?
                        </a>
                    </div>
                    <div className="mt-6">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                            type="submit"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                    
                </form>
                {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
            </div>
        </div>
    );
};

export default Login;
