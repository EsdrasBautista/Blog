'use client'
import { Article } from '@/types/article';
import { ArticleContextType } from '@/types/auth';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2'


const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const SinFavotirosAlert = () => {
        Swal.fire({
          title: 'Alerta',
          text: 'No tienes articulos favoritos',
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        })
    }

    const ErrorMessage = (titulo: string, contenido: string) =>{
      Swal.fire({
            title: titulo,
            text: contenido,
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          })
    }

    const SuccesMessage =  (titulo: string, contenido: string) =>{
      Swal.fire({
            title: titulo,
            text: contenido,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          })
    }

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
        const response = await  fetch(`http://localhost:5000/article/${id}`,{
          method: 'GET',
          credentials: 'include'
        });
        
        if(!response.ok) {
          ErrorMessage("Error",`Error al obtener el articulo por su id ${id}`)
          throw new Error("Error Articulo no encontrado");
        }
        const data = await response.json();
        return data; // Retorna el artículo encontrado
      }catch(error){
        console.error(`Error al obtener el articulo por su id ${id} : `, error);
        ErrorMessage("Error",`Error al obtener el articulo por su id ${id}, try catch`)
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
          SuccesMessage("Creado","Articulo Creado con exito")
          return {success:true,message: "Articulo creado con exito"};
        }else{
          ErrorMessage("Error", "Error al crear el Articulo")
          return {success:false,message: "Error al crear el articulo"};
        }
        
      }catch(error){
        console.error("Error al crear el articulo: ",error);
        ErrorMessage("Error", "Error al crear el Articulo")
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
        const data = await response.json();
        if(!response.ok){
          ErrorMessage("Error",data.message)
          return 
        }else{
          setArticles(prev => prev.filter(article => article.id !== id))
        }
      
      }catch(error){
        ErrorMessage("Error","Hubo un error al intentar eliminar un arituclo")
        console.error("Error al borrar el articulo: ", error);
      }
    }

    const fetchGetFavorite = async() =>{
      try{
        const response = await fetch('http://localhost:5000/get-favorites',{
          method: 'GET',
          credentials: 'include',
          headers: {'Content-type': 'application/json'},
          
        })
        const data = await response.json()
        if (!response.ok) {
          ErrorMessage("Error","Error al obtener los articulos favoritos" )
          throw new Error("Error en el fetch para obtener los favoritos")
        }

        
        if (!Array.isArray(data) || data.length === 0) {
          SinFavotirosAlert() 
          return
        }
        
        setArticles(data)

      }catch(error){
        console.error("Error al obtener los favoritos ", error)
        ErrorMessage("Error","Error al obtener los articulos favoritos" )
      }
    }

    const fetchUpdatedArticle = async(updatedArticle: Partial<Article>, id: number): Promise<void> =>{
      try{
        const response = await fetch(`http://localhost:5000/update-article/${id}`,{
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(updatedArticle)
        })
        if(!response.ok){
          ErrorMessage("Error", "No se pudo actualizar el artículo.");
          return
        }
        const updated = await response.json();
        setArticles(prev => prev.map(article => article.id === updated.id ? updated : article))

      }catch(error){
        ErrorMessage("Error","Ocurrio un problema en la actualizacion del articulo")
      }
    }

  return(
    <ArticleContext.Provider value={{ articles,  filteredArticles, setFilteredArticles, add_favorite, loading,fetchArticleById, fetchCreateArticle, fetchDeleteArticle, fetchGetFavorite,fetchUpdatedArticle }}>
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
