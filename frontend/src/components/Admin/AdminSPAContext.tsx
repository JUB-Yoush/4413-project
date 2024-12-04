import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type of the context
interface ContextType {
    currentPage: string;
    setCurrentPage: (currentPage: string) => void;
}

// Create the context
const SPAContext = createContext<ContextType | undefined>(undefined);

// Create the provider component
export const CurrentPageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentPage, setCurrentPageState]
        = useState<string>("summary");


    const setCurrentPage = (newCurrentPage: string) => {
        if(newCurrentPage === "dashboard" || newCurrentPage === "inventory" || newCurrentPage === "orders"
            || newCurrentPage === "users" || newCurrentPage === "sales"){
            setCurrentPageState(newCurrentPage);
        }else{
            console.log("Incorrect page selection type");
        }
    };

    return (
        <SPAContext.Provider value={{ currentPage, setCurrentPage}}>
            {children}
        </SPAContext.Provider>
    );
};

// Create a custom hook for using the SPAContext
export const useSPAContext = (): ContextType => {
    const context = useContext(SPAContext);
    if (!context) {
        throw new Error('useSPAContext must be used within a CurrentPageProvider');
    }
    return context;
};
