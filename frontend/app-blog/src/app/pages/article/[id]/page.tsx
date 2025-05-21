
'use client';

import React, { useEffect, useState } from "react";
import Layout from "../../../Components/layout";
import { Article } from "@/types/article";
import { useArticleContext } from "@/context/ArticleProvider";
import { CreateArticleModal } from "@/app/Components/CreateArticleModal";
import { useAuth } from "@/context/AuthProvider";
import { UpdateArticleModal } from "@/app/Components/ActualizarArticuloModal";


const ArticlePage = ({ params }: { params: Promise<{ id: string }> }) => {

    const [article, setArticle] = useState<Article | null>(null);
    const { fetchArticleById, fetchCreateArticle, fetchUpdatedArticle} = useArticleContext();
    const [isModal, SetisModal] = useState(false);
    const [isModalUpdate, SetisModalUpdate] = useState(false);
    const {userId} = useAuth();

    const openeModalUpdate = () => SetisModalUpdate(true);
    const closeModalUpdate = () => SetisModalUpdate(false);


    
    const openeModal = () => SetisModal(true);
    const closeModal = () => SetisModal(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const resolveParams = await params;
                const articleData = await fetchArticleById(parseInt(resolveParams.id));
                setArticle(articleData);
            } catch (error) {
                console.error("Error al obtener el articulo: ", error);
            }
        };
        fetchArticle();
    }, [params, fetchArticleById])
    
    const isAuthor = userId === article?.user_id
    console.log("usuario: ",userId, " usuarioArticulo: ", article?.user_id, " Es autor: ", isAuthor )

    if (!article) {
        return (
            <Layout hableOpenModal={openeModal}>
                <div className="flex justify-center items-center h-screen">
                    <h1 className="text-4xl font-bold text-indigo-600">Cargando Articulos...</h1>
                </div>
                <div className="flex flex-col items-center justify-center h-screen">
                    <a href="/" className="text-indigo-600 hover:underline mt-4 inline-block text-center">Volver a la lista de artículos</a>
                </div>

                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isModal ? "opacity-100 visible" : "opacity-0 invisible"}`}
                    aria-hidden={!isModal}
                    >
                    {isModal && (
                    <CreateArticleModal onClose={closeModal} onSubmit={fetchCreateArticle} />
                    )}
                </div>

            </Layout>
        )
    }
    

    return (
        <Layout hableOpenModal={openeModal}>
            <div className="container mx-auto py-12 px-4">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto transition-transform hover:scale-[1.01] duration-300">
                    <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 text-center">{article.title}</h1>
                    <img src={article.imagen_url} alt={article.title} className="w-full h-auto rounded-md mb-6 shadow-md" />
                    <p className="text-lg text-gray-700 leading-relaxed mb-6  text-center">{article.content}</p>
                    <div className="text-sm text-gray-500 text-center">
                        <p><strong>Autor:</strong> {article.author}</p>
                        <p><strong>Fecha de creación:</strong> {new Date(article.fecha_creacion).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-8 flex justify-between items-center">
                        <a href="/" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-800 transition duration-300 shadow-md">
                            ← Volver a la lista de artículos
                        </a>

                        {isAuthor && (
                            <button className="inline-block bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition duration-300 shadow-md cursor-pointer"
                                onClick={openeModalUpdate}>
                                Actualizar Datos Articulo
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isModal ? "opacity-100 visible" : "opacity-0 invisible"}`}
            aria-hidden={!isModal}
            >
            {isModal && (
              <CreateArticleModal onClose={closeModal} onSubmit={fetchCreateArticle} />
            )}
            </div>

            <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isModalUpdate ? "opacity-100 visible" : "opacity-0 invisible"}`}
            aria-hidden={!isModalUpdate}
            >
            {isModalUpdate && (
                <UpdateArticleModal
                    article={article}
                    onClose={closeModalUpdate}
                    onUpdate={async (updatedArticle) => {
                        if (article) {
                            await fetchUpdatedArticle(updatedArticle, article.id);
                        }
                    }}
                />
            )}
            </div>
            
        </Layout>

    )
}
export default ArticlePage;