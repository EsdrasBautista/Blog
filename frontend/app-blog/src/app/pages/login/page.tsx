
'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../Components/layout";
import toast from 'react-hot-toast';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // sirve para evitar que la pagina se recargue al enviar el formulario

        const response = await fetch(`http://localhost:5000/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // para enviar la cookie de sesion
            body: JSON.stringify({ email, password })
        }); 
        const data = await response.json();
        if(!response.ok){
            toast.error("Error al loguearse, revisa tus credenciales!")
            console.log("datos error", data); 
        }else{
            toast.success(data.message + " 🎉");
            router.push("/");
            
        }
    }
    

    return (
        <Layout  hableOpenModal={() => {}}>
            <div className="container mx-auto py-10">
                <h1 className="text-4xl font-bold mb-6 text-indigo-600 text-center">Iniciar Sesion</h1>
                
                <form onSubmit={handleLogin} className="max-w-2xl mx-auto bg-white p-12 rounded-2xl shadow-lg border border-gray-200"> 
                     <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Iniciar Sesion</button>
                    </div>
                </form> 
                <div className="mt-4 text-center">
                    <p className="text-gray-600">¿No tienes una cuenta? <a href="/register" className="text-indigo-600 hover:underline">Registrate</a></p>
                </div>
            </div>
        </Layout>
    )

}

export default Login;