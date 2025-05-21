import React from "react";
import Link from "next/link";
import { SearchBar } from "./searchBar";
import { NavbarProps } from "@/types/article";
import {faSignInAlt,faSignOutAlt,faPlus,faHeart,faUser,faUserPlus,faComputer} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useArticleContext } from "@/context/ArticleProvider";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Navbar: React.FC<NavbarProps> = ({ articles, setFilteredArticles, hableOpenModal }) => {
  const { fetchGetFavorite } = useArticleContext();
  const { isAuthenticated, logout, nameAuthor } = useAuth();
  const router = useRouter();


  const handleLogout = async () => {
    try {
      await fetch(`http://localhost:5000/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (window.location.pathname === "/") {
        window.location.reload();
      } else {
        router.push("/");
      }
      logout();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cerrar sesión",
        text: "No se pudo cerrar la sesión correctamente.",
      });
    }
  };

  const confirmLogOut = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión se cerrará en este dispositivo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Sesión cerrada",
          icon: "success",
          showConfirmButton: false,
          timer: 1300,
        }).then(() => handleLogout());
      }
    });
  };

 
  return (
    
    <nav className="bg-gray-600 sticky top-0 z-50 shadow-md py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-6 w-full md:w-auto justify-between text-white">
          <a href="/" className="flex items-center gap-2 text-white cursor-pointer">
            <FontAwesomeIcon icon={faComputer} className="h-8 w-8" />
            <span className="text-2xl font-bold">MyBlog</span>
          </a>

          <div className="hidden md:block w-full max-w-md">
            <SearchBar articles={articles} setFilteredArticles={setFilteredArticles} />
          </div>
        </div>


        <ul className="flex flex-wrap justify-center items-center gap-5 text-white">
          {isAuthenticated ? (
            <>
              <li>
                <button
                  onClick={fetchGetFavorite}
                  className="flex items-center gap-2 hover:text-gray-300 transition duration-200 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faHeart} className="h-5 w-5" />
                  Mis Favoritos
                </button>
              </li>
              <li>
                <button
                  onClick={hableOpenModal}
                  className="flex items-center gap-2 hover:text-gray-300 transition duration-200 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                  Crear Artículo
                </button>
              </li>
              <li>
                <a href="/" className="flex items-center gap-2 text-white cursor-pointer">
                  <FontAwesomeIcon icon={faComputer} className="h-8 w-8" />
                  <span className="flex items-center gap-2 hover:text-gray-300 transition duration-200 cursor-pointer">Inicio</span>
                </a>
              </li>
              <li>
                <button
                  onClick={confirmLogOut}
                  className="flex items-center gap-2 hover:text-gray-300 transition duration-200 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                  Cerrar sesión
                </button>
              </li>
              
              <li className="flex items-center gap-2 text-sm text-white font-medium">
                <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                {nameAuthor?.toUpperCase()}
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/pages/login"
                  className="flex items-center gap-2 hover:text-gray-300 transition duration-200 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="h-5 w-5" />
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/create"
                  className="flex items-center gap-2 hover:text-gray-300 transition duration-200 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5" />
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
