import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "./searchBar";
import { Article, NavbarProps } from "@/types/article";
import toast from 'react-hot-toast';



const Navbar: React.FC<NavbarProps> = ({articles,setFilteredArticles, hableOpenModal}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        
        const ckeckAuth = async () => {
            try{
                const response = await fetch(`http://localhost:5000/check-auth`,{
                    method: 'GET',
                    credentials: 'include',
                })
                const data = await response.json();
                setIsAuthenticated(data.autenticado);
            }catch(error){
                console.log("error en: ", error)
            }
        }

        ckeckAuth();
    },[])

    const handleLogout = async () => {
        
        try {
            const response = await fetch(`http://localhost:5000/logout`, {
                method: 'POST',
                credentials: 'include',
            })
            const data = await response.json();
            setIsAuthenticated(false);
            toast.success(data.message + " 🎉");
            router.push("/");

        } catch (error) {
            toast.error("Error al desloguearse")
            console.log("error en: ", error)
        }
    }

    

    return(
        <nav className="bg-indigo-600 py-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
               <div className="flex items-center space-x-4"> 
                    <a href="/" className="text-xl font-bold">Blog</a>
                    <SearchBar
                        articles={articles}
                        setFilteredArticles={setFilteredArticles} // estado para filtrar los articulos
                    />
               </div>
               <ul className="flex space-x-4 items-center">
                    
                    {isAuthenticated ? (
                        <>  
                            <li className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM8 9h4v1H8V9zm0 2h4v1H8v-1z" />
                                </svg>
                                <button onClick={hableOpenModal} className="text-indigo-600 hover:underline m-1 inline-block">
                                    <span className="text-white font-semibold hover:text-gray-300 cursor-pointer">Crear Articulo </span>
                                </button>
                            </li>
                            <li className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM8 9h4v1H8V9zm0 2h4v1H8v-1z" clipRule="evenodd" />
                                </svg>
                                <button onClick={handleLogout} className="text-indigo-600 hover:underline m-1 inline-block">
                                    <span className="text-white font-semibold hover:text-gray-300 cursor-pointer">Logout </span>
                                </button>
                            </li>
                        </>
                        
                    ) : (
                        <li className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM8 9h4v1H8V9zm0 2h4v1H8v-1z" clipRule="evenodd" />
                            </svg>
                            <Link href="/pages/login" className="text-indigo-600 hover:underline m-1 inline-block">
                                <span className="text-white font-semibold hover:text-gray-300 cursor-pointer">Login </span>
                            </Link>                    
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    )
}
export default Navbar;