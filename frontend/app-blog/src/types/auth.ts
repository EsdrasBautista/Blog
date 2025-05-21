import React from "react";
import { Article } from "./article";

export interface AuthContextType{
    isAuthenticated: boolean;
    loading: boolean;
    login: () => void;
    logout: () => void;
    nameAuthor: string;
    userId: number | null;
    handleRegister: (username: string, email:string, password: string) => Promise<{success: boolean, message: string}>;

}

export interface ArticleContextType{
    articles: Article[];
    filteredArticles: Article[];
    setFilteredArticles: React.Dispatch<React.SetStateAction<Article[]>>; // el dispatch hace que se actualice el estado
    fetchArticleById: (id: number) => Promise<Article | null>;
    add_favorite: (id: number) => void; // el dispatch hace que se actualice el estado
    loading: boolean;
    fetchCreateArticle: (newArticle: Partial<Article>) => Promise<{success: boolean, message: string}>;
    fetchDeleteArticle: (id: number) => Promise<void>;
    fetchGetFavorite: () => Promise<void>;
    fetchUpdatedArticle: (updatedArticle: Partial<Article>, id: number) =>Promise<void>;
}

