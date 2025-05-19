'use client'
import { AuthContextType } from '@/types/auth';
import React, {createContext, useContext, useState, useEffect} from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [nameAuthor, setNameAuthor]=  useState("");

    useEffect(() => {
        const checkAuthStatus = async () =>{
            try{
                const response = await fetch('http://localhost:5000/check-auth', {
                    method: 'GET',
                    credentials: 'include', // incluir coockies
                });
                const data = await response.json();
                setIsAuthenticated(data.autenticado);
                setNameAuthor(data.userName);

            }catch(error){
                setIsAuthenticated(false);
                console.error("Error al verificar la autenticación: ", error);
            } finally{
                setLoading(false);
            }
        };
        checkAuthStatus();
    },[]);

    const login = () => setIsAuthenticated(true); // Función para iniciar sesión
    const logout = () => setIsAuthenticated(false); // Función para cerrar sesión

    return(
        <AuthContext.Provider value= {{ isAuthenticated, loading, login, logout, nameAuthor }}>
            {children}
        </AuthContext.Provider>
    )    
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe de usarse dentro de un AuthProvider');
    }
    return context;
};