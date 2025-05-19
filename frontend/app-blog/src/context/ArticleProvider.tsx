'use client'
import { Article } from '@/types/article';
import { ArticleContextType } from '@/types/auth';
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';


const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // obtener todos los articulos
    useEffect(() => {
        const fetchArticles = async () => {
            try{
                const response = await fetch('http://localhost:5000/articles');
                const data = await response.json();
                setArticles(data);
                setFilteredArticles(data);
            }catch(error){
                console.error("Error al obtener los articulos: ",error);
            }finally{
                setLoading(false);
            }
        };

        fetchArticles();

    }, []);

    // obtener articulos por su id
    const fetchArticleById = async (id:number): Promise<Article | null> =>{
      const existeArticulo = articles.find(article => article.id === id);
      if(existeArticulo){
        return existeArticulo; // Si existe, retorna el artículo
      }


      try{
        const response = await  fetch(`http://localhost:5000/article/${id}`);
        
        if(!response.ok) {
          throw new Error("Error Articulo no encontrado");
        }
        const data = await response.json();
        return data; // Retorna el artículo encontrado
      }catch(error){
        console.error(`Error al obtener el articulo por su id ${id} : `, error);
        return null; // Retorna null si no se encuentra el artículo
      }
    }

    // agregar o quitar de favoritos
    const add_favorite = (id: number) => {
    setArticles(
      prevArticles => prevArticles.map(article =>{
        if (article.id === id) {
          return { ...article, is_favorite: !article.is_favorite }; // actualiza el estado del artículo !article.is_favorite significa que si es true lo cambia a false y viceversa
        }
        return article;
      })
    )

    const updatedArticle = articles.find(article => article.id === id); // Encuentra el artículo actualizado
    
    fetch(`http://127.0.0.1:5000/add-favorite/${id}`,{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
        },
      body: JSON.stringify({is_favorite: updatedArticle? !updatedArticle.is_favorite : false}) // si updatedArticle es undefined, lo cambia a false
    }).catch(error => console.error("Error al actualizar el favorito: ", error));

  }

    // crear un nuevo articulo    (el partial se usa para indicar que no todos los atributos son requeridos)
    const fetchCreateArticle = async (newArticle: Partial<Article>): Promise<{success:boolean,message:string}>  =>{
      
      try{
        const response = await fetch('http://localhost:5000/create-article',{
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-type': 'application/json',

          },
          body: JSON.stringify(newArticle)
        })

        if(response.ok){
          const data = await response.json();
          setArticles(prevArticles => [...prevArticles, data])
          toast.success("Artículo creado con éxito 🎉");
          return {success:true,message: "Articulo creado con exito"};
        }else{
          toast.error("Error del servidor al crear el artículo");
          return {success:false,message: "Error al crear el articulo"};
        }
        
      }catch(error){
        console.error("Error al crear el articulo: ",error);
        return {success:false,message:"Error al crear el articulo"};
      }
    }

    const fetchDeleteArticle = async(id:number) =>{
      try{
        const response = await fetch(`http://localhost:5000/delete-article/${id}`,{
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json'
          },
          credentials: 'include'
        })
        if(!response.ok){
          throw new Error("Hubo un error al intentar eliminar un arituclo")
        }
        const data = await response.json()
        setArticles(prev => prev.filter(article => article.id !== id))
        toast.success(data.message + " 🎉");
        
      }catch(error){
        toast.error("Error al borrar el articulo!")
        console.error("Error al borrar el articulo: ", error);
      }
    }


  return(
    <ArticleContext.Provider value={{ articles,  filteredArticles, setFilteredArticles, add_favorite, loading,fetchArticleById, fetchCreateArticle, fetchDeleteArticle }}>
        {children}
    </ArticleContext.Provider>
  )

}

export const useArticleContext = () =>{
    const context = useContext(ArticleContext);
    if(!context){
        throw new Error("useArticleContext debe de ser usado dentro de un ArticleContextProvider");
    }
    return context;
}
