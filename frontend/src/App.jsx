// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourierDashboard from './pages/CourierDashboard';
import OrdersPage from './pages/OrdersPage';


import './styles/App.css';

const App = () => (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path='/home-page' element={<CustomerDashboard />} />
                <Route path='/admin-dashboard' element={<AdminDashboard />} />
                <Route path='/courier-dashboard' element={<CourierDashboard />} />
                <Route path="/my-orders" element={<OrdersPage />} />
            </Routes>
        </Router>
    </AuthProvider>
);

export default App; // Ensure App is exported as default
