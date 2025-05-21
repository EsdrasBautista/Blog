import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faArrowRight,
  faTrash,
  faAngry,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { CardProps } from "@/types/article";
import { useAuth } from "@/context/AuthProvider";
import { useArticleContext } from "@/context/ArticleProvider";
import Swal from "sweetalert2";

const Card: React.FC<CardProps> = ({ id, fetchDeleteArticle }) => {
  const { isAuthenticated, userId } = useAuth();
  const { articles, add_favorite } = useArticleContext();
  const articlee = articles.find(a => a.id === id)

  if (!articlee) {
    return <div className="text-center text-gray-500">Artículo no encontrado</div>;
  }

  const isAuthor = userId === articlee.user_id;

  const confirmDelete = () => {
    Swal.fire({
      title: "¿Eliminar artículo?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetchDeleteArticle(id);
        Swal.fire("Eliminado", "El artículo fue eliminado con éxito.", "success");
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={articlee.imagen_url}
          alt={articlee.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => add_favorite(id)}
              className="bg-white/90 backdrop-blur-md rounded-full p-2 shadow-md hover:scale-110 transition cursor-pointer"
              title="Agregar a favoritos"
            >
              <FontAwesomeIcon
                icon={articlee.is_favorite ? faHeart : farHeart}
                className={`h-5 w-5 ${
                  articlee.is_favorite ? "text-green-500" : "text-gray-600"
                }`}
              />
            </button>
            {isAuthor && (
              <button
                onClick={confirmDelete}
                className="bg-white/90 backdrop-blur-md rounded-full p-2 shadow-md hover:scale-110 transition cursor-pointer"
                title="Eliminar artículo"
              >
                <FontAwesomeIcon icon={faTrash} className="h-5 w-5 text-red-600" />
              </button>
            )}
          </>
        ) : (
          <Link href="/pages/login">
            <button
              className="bg-white/90 backdrop-blur-md rounded-full p-2 shadow-md hover:scale-110 transition"
              title="Inicia sesión"
            >
              <FontAwesomeIcon icon={faAngry} className="h-5 w-5 text-gray-600" />
            </button>
          </Link>
        )}
      </div>

      {/* Contenido del articulo */}
      <div className="p-6">
        <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-indigo-50 rounded-full mb-4">
          Blog
        </span>

        <h2 className="text-xl font-bold text-gray-800 mb-2 ">
          {articlee.title}
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          {articlee.content.length > 150
            ? `${articlee.content.slice(0, 150)}...`
            : articlee.content}
        </p>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/40"
              alt="Author"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {articlee.author}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(articlee.fecha_creacion).toLocaleDateString()}
              </p>
            </div>
          </div>

          <a href={`/pages/article/${id}`}>
            <span className="inline-flex items-center text-indigo-600 hover:text-indigo-500 transition-colors duration-300">
              <span className="mr-2 text-sm font-medium">Leer más</span>
              <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
            </span>
          </a>

        </div>
      </div>
    </div>
  );
};

export default Card;
