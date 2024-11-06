// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import MyOrders from './pages/MyOrders';
import AssignedOrders from './pages/AssignedOrders';
import ManageOrders from './pages/ManageOrders';
import './styles/App.css';

const App = () => (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/assigned-orders" element={<AssignedOrders />} />
                <Route path="/manage-orders" element={<ManageOrders />} />
            </Routes>
        </Router>
    </AuthProvider>
);

export default App; // Ensure App is exported as default
