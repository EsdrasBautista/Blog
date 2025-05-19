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
  const {nameAuthor} = useAuth();

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
          <h1 className="text-4xl font-bold mb-6 text-indigo-600 ">Bienvenido al Blog {nameAuthor || ""}</h1>
          <p className="text-lg mb-6">Aquí encontrarás los últimos artículos.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center">
            

            {filteredArticles.map(article => (
              
                <Card
                  key={article.id}
                  article={article}
                  fetchDeleteArticle = {fetchDeleteArticle}
                />
              
            ))}


          </div>

          {isModal &&
            <CreateArticleModal onClose={closeModal} onSubmit={fetchCreateArticle} />
          }

        </div>
      </Layout>
    </>
  )
}