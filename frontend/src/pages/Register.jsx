// src/pages/Register.js
import React, { useState } from 'react';
import { registerUser } from '../services/apiService';
import InputField from '../components/InputField';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ name, email, phone, password, role });
            alert('Registration successful');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="register-form">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <InputField label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputField label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <InputField label="Role" type="text" value={role} onChange={(e) => setRole(e.target.value)} />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
