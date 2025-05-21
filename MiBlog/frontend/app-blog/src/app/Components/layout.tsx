import React  from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { Article, LayoutProps } from "@/types/article";
import { useArticleContext } from "@/context/ArticleProvider";
 

const Layout: React.FC<LayoutProps> = ({children, hableOpenModal}) => {
    const {articles, setFilteredArticles} = useArticleContext();
    return(
        <div className="flex flex-col min-h-screen">
            <Navbar articles={articles} setFilteredArticles={setFilteredArticles} hableOpenModal={hableOpenModal}  />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout;
