import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    AuthTokenManager,
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    verifyToken
} from '../api/auth.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    // Initialize authentication on app start
    useEffect(() => {
        initAuth();
    }, []);

    // Listen for authentication events
    useEffect(() => {
        const handleTokenExpired = () => {
            console.log('Token expired event received');
            handleLogout();
        };

        const handleAccessDenied = () => {
            console.log('Access denied event received');
            // Show notification or redirect
        };

        window.addEventListener('auth:tokenExpired', handleTokenExpired);
        window.addEventListener('auth:accessDenied', handleAccessDenied);

        return () => {
            window.removeEventListener('auth:tokenExpired', handleTokenExpired);
            window.removeEventListener('auth:accessDenied', handleAccessDenied);
        };
    }, []);

    const initAuth = async () => {
        try {
            setLoading(true);

            if (isAuthenticated()) {
                // Verify existing token
                try {
                    await verifyToken();
                    const userInfo = getCurrentUser();
                    setUser(userInfo);
                    setAuthenticated(true);
                    console.log('Existing authentication verified:', userInfo);
                } catch (error) {
                    console.log('Existing token invalid, attempting auto-login...');
                    await autoLogin();
                }
            } else {
                // No existing auth, attempt auto-login for development
                await autoLogin();
            }
        } catch (error) {
            console.error('Auth initialization failed:', error);
            setUser(null);
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const autoLogin = async () => {
        try {
            console.log('Attempting admin auto-login...');
            const result = await login('admin@gmail.com', 'admin123');

            if (result && result.user) {
                setUser(result.user);
                setAuthenticated(true);
                console.log('Admin auto-login successful:', result.user);
            }
        } catch (error) {
            console.warn('Auto-login failed:', error.message);
            setUser(null);
            setAuthenticated(false);
        }
    };

    const handleLogin = async (email, password) => {
        try {
            setLoading(true);
            const result = await login(email, password);

            if (result && result.user) {
                setUser(result.user);
                setAuthenticated(true);
                console.log('Login successful:', result.user);
                return result;
            }

            throw new Error('Login failed: Invalid response');
        } catch (error) {
            console.error('Login error:', error);
            setUser(null);
            setAuthenticated(false);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setAuthenticated(false);
        console.log('User logged out');
    };

    const refreshUserInfo = () => {
        const userInfo = getCurrentUser();
        setUser(userInfo);
        setAuthenticated(!!userInfo);
    };

    // Helper functions
    const hasRole = (roleName) => {
        return user && user.roles && user.roles.some(role => role.name === roleName);
    };

    const hasAnyRole = (roleNames) => {
        return user && user.roles && user.roles.some(role =>
            roleNames.includes(role.name)
        );
    };

    const getUserRoles = () => {
        return user && user.roles ? user.roles.map(role => role.name) : [];
    };

    const value = {
        // State
        user,
        loading,
        authenticated,

        // Actions
        login: handleLogin,
        logout: handleLogout,
        refreshUserInfo,

        // Helper functions
        isAdmin: () => hasRole('ADMIN'),
        hasRole,
        hasAnyRole,
        getUserRoles,

        // Token management
        getToken: AuthTokenManager.getToken,
        hasToken: AuthTokenManager.hasToken,

        // Re-initialize auth
        initAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
