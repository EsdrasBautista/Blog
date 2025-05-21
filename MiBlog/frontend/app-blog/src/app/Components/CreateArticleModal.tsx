import { CreateArticleModalProps } from "@/types/article";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";

export const CreateArticleModal: React.FC<CreateArticleModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagen_url, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit({ title, content, imagen_url });
      Swal.fire({
        icon: "success",
        title: "Artículo creado",
        text: "Tu artículo ha sido publicado exitosamente.",
        confirmButtonColor: "#3085d6",
      });
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al crear",
        text: "Hubo un problema al guardar el artículo.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600 text-center w-full">Crear Nuevo Artículo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Título</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ej: ¿Qué es Next.js?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Contenido</label>
            <textarea
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Comparte tu experiencia o información relevante..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">URL de Imagen</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="https://..."
              value={imagen_url}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg cursor-pointer"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
