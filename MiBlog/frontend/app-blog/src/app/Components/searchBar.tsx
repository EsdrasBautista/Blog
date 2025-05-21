import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Article, SearchBarProps } from "@/types/article";




export const SearchBar: React.FC<SearchBarProps> = ({ articles, setFilteredArticles }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {

    if (setFilteredArticles) {
      if (query === "") {
        setFilteredArticles(articles);
      } else {
        setFilteredArticles(
          articles.filter((article: Article) =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            article.author.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
    }
  }, [query, articles, setFilteredArticles]);

  return (
    <div className="relative w-full max-w-3xl mx-auto my-5">
      <input
        type="text"
        placeholder="Buscar artículos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-12 pr-15 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-white-800 text-sm"
      />
      <div className="absolute left-4 top-3 text-white-800">
        <FontAwesomeIcon icon={faSearch} className="h-7 w-5" />
      </div>
    </div>
  );
};
