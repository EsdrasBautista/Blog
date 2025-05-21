'use client'
import { AuthContextType } from '@/types/auth';
import React, {createContext, useContext, useState, useEffect} from 'react';
import { usePathname } from "next/navigation";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [nameAuthor, setNameAuthor]=  useState("");
    const [userId,setUserId] = useState<number | null>(null);
    

    useEffect(() => {
        const checkAuthStatus = async () =>{
            try{
                const response = await fetch('http://localhost:5000/check-auth', {
                    method: 'GET',
                    credentials: 'include',

                });

                const data = await response.json();
                console.log("datos: " + data.autenticado, "ID: ",data.userid )
                if(data.autenticado){
                    console.log("loggueado")
                    setIsAuthenticated(data.autenticado);
                    setNameAuthor(data.userName);
                    setUserId(data.userid);
                }else{
                    setIsAuthenticated(false)
                    setNameAuthor('')
                    setUserId(null)
                }
                

            }catch(error){
                console.error("Error al verificar la autenticación: ", error);
                setIsAuthenticated(false);
                setNameAuthor("");
                
            } finally{
                setLoading(false);
            }
        };
        checkAuthStatus();
    },[usePathname]);

    const login = () => setIsAuthenticated(true); // Función para iniciar sesión
    const logout = () => setIsAuthenticated(false); // Función para cerrar sesión

    
    const handleRegister = async (username:string, email: string, password:string): Promise<{success: boolean, message: string}> => {

        try{
            const response = await fetch(`http://localhost:5000/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({ username, email, password }),
                });
            
                if (!response.ok) {
                    return {success: false, message: 'Error en el fetch'}
                } else {
                    const data = await response.json();
                    setIsAuthenticated(true);
                    setNameAuthor(data.username);
                    setUserId(data.id);
                    
                    return {success: true, message:data.message}
                }

        }catch(error){
            console.error('Error registro: ', error)
            return {success: false, message: 'Error de conexion'}
        }
    }



    return(
        <AuthContext.Provider value= {{ isAuthenticated, loading, login, logout, nameAuthor, userId, handleRegister }}>
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