import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: 1,
        email: 'admin@gmail.com',
        roles: [{ name: 'ADMIN' }]
    });
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(true);

    const initAuth = async () => {
        console.log('Auth initialized');
        // Giả lập đăng nhập admin
        setUser({
            id: 1,
            email: 'admin@gmail.com',
            roles: [{ name: 'ADMIN' }]
        });
        setAuthenticated(true);
        setLoading(false);
    };

    const handleLogin = async (email, password) => {
        console.log('Login attempt:', email, password);
        setUser({
            id: 1,
            email: email,
            roles: [{ name: 'ADMIN' }]
        });
        setAuthenticated(true);
        return { user: { email, roles: [{ name: 'ADMIN' }] } };
    };

    const handleLogout = () => {
        setUser(null);
        setAuthenticated(false);
    };

    const hasRole = (roleName) => {
        return user && user.roles && user.roles.some(role => role.name === roleName);
    };

    const isAdmin = () => hasRole('ADMIN');

    const value = {
        user,
        loading,
        authenticated,
        login: handleLogin,
        logout: handleLogout,
        initAuth,
        isAdmin,
        hasRole,
        getToken: () => localStorage.getItem('authToken') || 'dummy-token',
        hasToken: () => true
    };

    // Sử dụng React.createElement thay vì JSX
    return React.createElement(AuthContext.Provider, { value }, children);
};

export default AuthContext;
