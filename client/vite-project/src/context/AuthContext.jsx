import { createContext, useState } from 'react';

export const AuthContext = createContext();

const getInitialAuthState = () => {
    const savedToken = localStorage.getItem('authToken');
    const savedRole = localStorage.getItem('userRole');
    const savedUser = localStorage.getItem('userData');

    if (savedToken && savedRole) {
        try {
            return {
                user: savedUser ? JSON.parse(savedUser) : null,
                token: savedToken,
                role: savedRole,
            };
        } catch {
            return { user: null, token: null, role: null };
        }
    }
    return { user: null, token: null, role: null };
};

export function AuthProvider({ children }) {
    const { user: initialUser, token: initialToken, role: initialRole } = getInitialAuthState();

    const [user, setUser] = useState(initialUser);
    const [token, setToken] = useState(initialToken);
    const [role, setRole] = useState(initialRole);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = (tokenData, userData, userRole) => {
        setToken(tokenData);
        setUser(userData);
        setRole(userRole);
        localStorage.setItem('authToken', tokenData);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userData', JSON.stringify(userData));
        setError(null);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setRole(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        setError(null);
    };

    const setAuthError = (errorMsg) => {
        setError(errorMsg);
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                role,
                isLoading,
                error,
                login,
                logout,
                setAuthError,
                clearError,
                setIsLoading,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
