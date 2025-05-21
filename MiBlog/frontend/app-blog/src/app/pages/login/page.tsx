
'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../Components/layout";
import Swal from 'sweetalert2'
import { faEnvelope, faLock, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from "next/link";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // sirve para evitar que la pagina se recargue al enviar el formulario

        const response = await fetch(`http://localhost:5000/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
            ErrorMessage();
            return
        }
          SuccesMessage(data.message)
           
    }

    const ErrorMessage = () => {
        Swal.fire({
            title: 'Error',
            text: 'Error al iniciar sesion, revisa tus credenciales!',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
        })
    }
    const SuccesMessage = (mensaje: string) => {
        Swal.fire({
            title: 'Exito',
            text: mensaje,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            timer: 1300
        }).then(() =>{
            router.push('/')
        })
    }


    return (
        <Layout hableOpenModal={() => { }}>
            <div className="container mx-auto py-10">
                <h1 className="text-4xl font-bold mb-6 text-indigo-600 text-center">Iniciar Sesion</h1>

                <form onSubmit={handleLogin} className="max-w-2xl mx-auto bg-white p-12 rounded-2xl shadow-lg border border-gray-200">
                    <div className="mb-4">

                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="h-5 w-9 text-gray"
                            />
                            Email:
                        </label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            <FontAwesomeIcon
                                icon={faLock}
                                className="h-5 w-9 text-gray"
                            />
                            Contraseña:
                        </label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="flex items-center justify-center py-4">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 pr-5 pl-2 rounded focus:outline-none focus:shadow-outline"
                        >
                            <FontAwesomeIcon
                                icon={faPaperPlane}
                                className="h-5 w-9 text-gray"
                            />
                            Iniciar Sesion
                        </button>
                    </div>
                </form>
                <div className="mt-4 text-center">

                    <p className="text-gray-600">¿No tienes una cuenta? <Link href="/pages/create" className="text-indigo-600 hover:underline">Registrate</Link></p>
                </div>
            </div>
        </Layout>
    )

}

export default Login;