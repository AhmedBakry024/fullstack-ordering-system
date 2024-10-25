// src/pages/Register.js
import React, { useState } from 'react';
import { registerUser } from '../services/apiService';
import InputField from '../components/InputField';
import '../styles/Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer'); // Default role set to 'customer'

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
                <div className="input-field">
                    <label htmlFor="role">Role</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="courier">Courier</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
