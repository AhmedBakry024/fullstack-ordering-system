import React, { useState } from 'react';
import { registerUser } from '../services/apiService';
import InputField from '../components/InputField';
import Navbar from '../components/Navbar'; // Adjust the path as needed
import '../styles/App.css';

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
            console.error(error);
            alert(error.message);

        }
    };

  return (
    <div className="bg-gray-900 h-screen">
      <Navbar />
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button type="submit" className="h-12 bg-zinc-200">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
