import { CreateArticleModalProps } from "@/types/article";
import React, { useState } from "react";

export const CreateArticleModal: React.FC<CreateArticleModalProps> = ({onClose,onSubmit}) =>{
    
    const [title, setTittle] = useState("");
    const [content, setContent] = useState("");
    const [imagen_url, setImageUrl] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit({title,content,imagen_url})
        onClose()
    }
    
    return (
        
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Crear Nuevo Articulo</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Titulo</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded" onChange={(e) => setTittle(e.target.value)} placeholder="Escribe el titulo del Articulo: " required value={title}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Contenido</label>
                        <textarea className="w-full p-2 border border-gray-300 rounded" onChange={(e) => setContent(e.target.value)} placeholder="Contenido del articulo: " required value={content}></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Imagen</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded" onChange={(e) => setImageUrl(e.target.value)} placeholder="Ingresa el URL de la imagen: " required value={imagen_url}></input>
                    </div>

                    <div className="flex justify-end">
                        <button className="bg-red-400 hover:bg-red-500 text-white px-4 rounded mr-2" type="button" onClick={onClose}>Cancelar</button>
                        <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 rounded mr-2" type="submit" >Crear Articulo</button>
                    </div>
                </form>
            </div> 
            
        </div>
    )
}