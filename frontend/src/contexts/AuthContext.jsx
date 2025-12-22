import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    // Verify token is still valid
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    // Don't remove token/user on mount - backend might not be running
                    // Just set user from localStorage
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Register function
    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, ...user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, ...user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Refresh user data from backend
    const refreshUser = async () => {
        try {
            const response = await api.get('/auth/me');
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true, user: userData };
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            return { success: false, message: 'Failed to refresh user data' };
        }
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user,
    };

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
