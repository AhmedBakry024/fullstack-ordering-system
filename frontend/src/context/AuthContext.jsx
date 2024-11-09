import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
    const [userId, setUserId] = useState(() => localStorage.getItem('userId') || null);
    const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || null);

    const login = (userData) => {
        setUser(userData);
        setUserId(userData.id); // Assuming userData contains an id field
        setUserRole(userData.role); // Assuming userData contains a role field

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userRole', userData.role);
    };

    const logout = () => {
        setUser(null);
        setUserId(null);
        setUserRole(null);

        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
    };

    useEffect(() => {
        // Optionally validate stored user session on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setUserId(userData.id);
                setUserRole(userData.role);
            } catch (error) {
                console.error('Failed to parse stored user data', error);
                logout(); // Clear corrupted data
            }
        }
    }, []);

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
