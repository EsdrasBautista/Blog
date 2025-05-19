
import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeart as fasHeart, faArrowRight, faAngry as fasAngry, faTrash as fastTrash } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart} from '@fortawesome/free-regular-svg-icons';
import { CardProps } from "@/types/article";
import { useAuth } from "@/context/AuthProvider";
import { useArticleContext } from "@/context/ArticleProvider";



const Card: React.FC<CardProps> = ({ article, fetchDeleteArticle }) => {
  const {isAuthenticated} = useAuth();
  const {articles, add_favorite} = useArticleContext();
  const articlee = articles.find(articlee => articlee.id === article.id);
  
  if(!articlee){
    return <div className="text-center text-gray-500">Artículo no encontrado</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative group">
      
      {/* Imagen con overlay gradiente */}
      <div className="relative overflow-hidden h-64">
        <img
          src={articlee.imagen_url}
          alt={articlee.title}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Botones de interacción */}

      <div className="absolute top-4 right-4 flex space-x-2">
       {isAuthenticated? (
        <>
          <button
            onClick={() => add_favorite(article.id)}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-all duration-300 group"
          >
            <FontAwesomeIcon
              icon={articlee.is_favorite ? faHeart : farHeart}
              className={`h-5 w-5 ${articlee.is_favorite ? 'text-green-500' : 'text-gray-600'} group-hover:scale-110 transition-all duration-300`}
            />
          </button>

            <button onClick={() => fetchDeleteArticle(article.id)} className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-all duration-300 group">
            <FontAwesomeIcon
              icon={fastTrash}
              className={`h-5 w-5 text-red-700 group-hover:scale-110 transition-all duration-300`}
            />
          </button>

        </>
       ):(
          <Link href="/pages/login">
            <button
              className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-all duration-300 group cursor-pointer" 
            >
              <FontAwesomeIcon
                icon={fasAngry}
                className="h-5 w-5 text-gray-600 group-hover:scale-110 transition-all duration-300"
              />
              <span className="text-sm text-gray-600">Inicia sesión para guardar los articulos</span>
            </button>
          </Link>
       )
       }  
        
      </div>

      {/* Contenido */}
      <div className="p-6 relative">
        {/* Etiqueta de categoría (puedes hacerla dinámica) */}
        <span className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full mb-4">
          Blog
        </span>

        {/* Título y contenido */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3 hover:text-indigo-600 transition-colors duration-300">
          {articlee.title}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          {articlee.content.length > 150 ? `${articlee.content.slice(0, 150)}...` : articlee.content}
        </p>

        {/* Footer con metadata y botón de leer más */}
        <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/40"
              alt="Author"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{articlee.author}</p>
              <p className="text-xs text-gray-500">{new Date(articlee.fecha_creacion).toLocaleDateString()}</p>
            </div>
          </div>

          <Link href={`/pages/article/${article.id}`}>
            <div className="inline-flex items-center text-indigo-600 hover:text-indigo-500 transition-colors duration-300">
              <span className="mr-2 text-sm font-medium">Leer más</span>
              <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
