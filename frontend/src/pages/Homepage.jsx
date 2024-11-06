import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Homepage = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [message, setMessage] = useState('');

    // Use effect to redirect based on user role after login
    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/manage-orders');
            } else if (user.role === 'courier') {
                navigate('/assigned-orders');
            } else if (user.role === 'customer') {
                navigate('/my-orders');
            }
        }
    }, [user, navigate]);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogout = () => {
        logout();
        setMessage('You have logged out successfully');
    };

    return (
        <div>
            {user ? (
                <div>
                    <p>Welcome, {user.name} ({user.role})</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <p>{message}</p>
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={handleRegister}>Register</button>
                </div>
            )}
        </div>
    );
};

export default Homepage;
