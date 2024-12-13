import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from "axios";

// Define the type of the context
interface TokenContextType {
    token: string | null;
    setToken: (token: string) => void;
    removeToken: () => void;
    userType: string | null;
    setUserType: (type: string) => void;
}

// Create the context
const TokenContext = createContext<TokenContextType | undefined>(undefined);

// Create the provider component
export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'));
    const [userType, setUserTypeState] = useState<string | null>(() => localStorage.getItem('userType'));
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`; //add authorization to header by default

    const setToken = (newToken: string) => {
        setTokenState(newToken);
        localStorage.setItem('token', newToken);
    };

    const removeToken = () => {
        setTokenState(null);
        setUserType("user");
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        alert("You have been signed out");
        setTimeout(() => {
            window.location.href = "/"; // Redirect to home or login page
        }, 100);
    };

    const setUserType = (type: string) => {
        if(type === "user" || type === "admin"){
            setUserTypeState(type);
            localStorage.setItem('userType', type);
        }else{
            console.log("Incorrect user type")
        }
    };

    return (
        <TokenContext.Provider value={{ token, setToken, removeToken, setUserType, userType }}>
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
