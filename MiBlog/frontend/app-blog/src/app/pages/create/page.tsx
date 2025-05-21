'use client'
import React, { useState } from "react";
import Layout from "../../Components/layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2'


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  

  const { handleRegister } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await handleRegister(username, email, password)
            if (result.success) {
                SuccesMessage(result.message);
                router.push("/");
            }else{
              ErrorMessage(result.message);
            }

        } catch (error) {
            ErrorMessage("Error de conexion")
        }
    }

  const ErrorMessage = (msg: string) => {
          Swal.fire({
              title: 'Error',
              text: msg,
              icon: 'warning',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
          });
      };
  
      const SuccesMessage = (msg: string) => {
          Swal.fire({
              title: 'Éxito',
              text: msg,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
          });
      };

  return (
    <Layout hableOpenModal={() => {}}>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-indigo-700 text-center">
            Crear Cuenta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-500" />
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                <FontAwesomeIcon icon={faLock} className="mr-2 text-gray-500" />
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div className="flex justify-center">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md flex items-center gap-2 transition">
                <FontAwesomeIcon icon={faPaperPlane} className="h-5 w-5" />
                Registrarse
              </button>
            </div>
          </form>

          <div className="text-center mt-6 text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/pages/login" className="text-indigo-600 hover:underline font-medium">
              Inicia Sesión
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
