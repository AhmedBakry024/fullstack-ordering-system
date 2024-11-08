// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const login = (userData) => {
        setUser(userData);
        setUserId(userData.id); // Assuming userData contains an id field
        setUserRole(userData.role); // Assuming userData contains a role field
    };

    const logout = () => {
        setUser(null);
        setUserId(null);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, userId, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for accessing AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;
