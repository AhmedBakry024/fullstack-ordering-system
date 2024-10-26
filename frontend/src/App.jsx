import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import './styles/App.css';

const App = () => (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    </AuthProvider>
);

export default App;
