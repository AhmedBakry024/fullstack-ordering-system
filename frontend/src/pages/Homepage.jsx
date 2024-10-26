// I want to display two buttons on the homepage, one for the user to sign in and one for the user to sign up.
// I want to display the user's name and email if they are logged in.
// I want to display a message if the user is not logged in.
// I want to display a message if the user is signed up successfully.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Homepage = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div>
            {user ? (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
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
}

export default Homepage;