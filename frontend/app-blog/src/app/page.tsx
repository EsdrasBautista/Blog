'use client';
import Layout from "./Components/layout";
import Card from "./Components/card";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { ArticleContextProvider, useArticleContext } from "@/context/ArticleProvider";
import { useState } from "react";
import { CreateArticleModal } from "./Components/CreateArticleModal";




export default function Home() {
  return (
    <AuthProvider>
      <ArticleContextProvider>
          <HomeContent />
      </ArticleContextProvider>
    </AuthProvider>
  )
}

function HomeContent() {
  const { filteredArticles, loading, fetchCreateArticle, fetchDeleteArticle } = useArticleContext();
  const [isModal, SetisModal] = useState(false);
  const { nameAuthor } = useAuth();

  const openeModal = () => SetisModal(true);
  const closeModal = () => SetisModal(false);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-bold text-indigo-600">Cargando Articulos...</h1>
      </div>
    )
  }

  return (
    <>

      <Layout hableOpenModal={openeModal}>

        <div className="container mx-auto py-10 text-center">
          <h1 className="text-4xl font-bold mb-6 text-indigo-700 font-serif">
            Hola, {nameAuthor?.toUpperCase() || "Bienvenido"}!
          </h1>

          <h3 className="text-2xl font-semibold mb-6 text-gray-600 font-serif">
            Explora las últimas publicaciones y comparte tus ideas.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center">


            {filteredArticles.map(article => (

              <Card
                key={article.id}
                id={article.id}
                fetchDeleteArticle={() => fetchDeleteArticle(article.id)}
              />

            ))}


          </div>

            <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isModal ? "opacity-100 visible" : "opacity-0 invisible"}`}
            aria-hidden={!isModal}
            >
            {isModal && (
              <CreateArticleModal onClose={closeModal} onSubmit={fetchCreateArticle} />
            )}
            </div>

        </div>
      </Layout>
    </>
  )
}