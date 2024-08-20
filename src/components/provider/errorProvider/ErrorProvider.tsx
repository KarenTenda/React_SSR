"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Alert } from 'react-bootstrap';

interface ErrorContextType {
    handleError: (message: string) => void;
    error: string | null;
    resetError: () => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export const useError = (): ErrorContextType => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
};

interface ErrorProviderProps {
    children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
    const [error, setError] = useState<string | null>(null);

    const handleError = useCallback((message:string) => {
        setError(message);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    return (
        <ErrorContext.Provider value={{ error, handleError, resetError }}>
            {children}
            {error && 
                <Alert variant="danger" onClose={resetError} dismissible style={{ 
                    display: 'inline-block', 
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '30%',
                    fontSize: '0.85rem' 
                }}>{error}</Alert>
            } 
        </ErrorContext.Provider>
    );
};
