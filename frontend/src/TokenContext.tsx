import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type of the context
interface TokenContextType {
    token: string | null;
    setToken: (token: string) => void;
    removeToken: () => void;
}

// Create the context
const TokenContext = createContext<TokenContextType | undefined>(undefined);

// Create the provider component
export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'));

    const setToken = (newToken: string) => {
        setTokenState(newToken);
        localStorage.setItem('token', newToken);
    };

    const removeToken = () => {
        setTokenState(null);
        localStorage.removeItem('token');
        setTimeout(() => {
            window.location.href = '/'; // Redirect to home or login page
        }, 1000);
    };

    return (
        <TokenContext.Provider value={{ token, setToken, removeToken }}>
            {children}
        </TokenContext.Provider>
    );
};

// Create a custom hook for using the TokenContext
export const useTokenContext = (): TokenContextType => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error('useTokenContext must be used within a TokenProvider');
    }
    return context;
};
