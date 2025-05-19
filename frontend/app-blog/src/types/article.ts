export  interface Article {
  id: number;
  title: string;
  content: string;
  imagen_url: string;
  author: string;
  fecha_creacion: string;
  is_favorite: boolean;
}

export interface NavbarProps{
    articles: Article[];
    setFilteredArticles?: (articles: Article[]) => void; // estado para filtrar los articulos
    hableOpenModal: () => void
}

export interface CardProps {
  article: Article;
  fetchDeleteArticle: (id: number) => Promise<void>;

}

export interface SearchBarProps {
  articles: Article[];
  setFilteredArticles?: (articles: Article[]) => void;
}


export interface LayoutProps {
    children: React.ReactNode;
    hableOpenModal: () => void
}

export interface CreateArticleModalProps{
  onClose: () => void;
  onSubmit: (newArticle: Partial<Article>) => Promise<{success:boolean, message:string}>;
}