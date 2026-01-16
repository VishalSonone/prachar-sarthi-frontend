import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminName = localStorage.getItem('adminName');
        if (token) {
            setUser({ token, adminName });
        }
        setLoading(false);
    }, []);

    const login = async (phoneNumber, password) => {
        const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5019';
        const response = await axios.post(`${baseUrl}/api/auth/login`, { phoneNumber, password });
        const { token, adminName } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('adminName', adminName);
        setUser({ token, adminName });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminName');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
