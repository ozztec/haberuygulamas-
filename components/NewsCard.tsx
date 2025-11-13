import React from 'react';
import { NewsArticle, Category } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  onClick: () => void;
  isLiked: boolean;
  onLikeToggle: (id: string) => void;
}

const categoryColors: Record<Category, string> = {
  [Category.Gundem]: 'bg-blue-500 text-blue-100',
  [Category.Ekonomi]: 'bg-green-500 text-green-100',
  [Category.Spor]: 'bg-red-500 text-red-100',
  [Category.Teknoloji]: 'bg-purple-500 text-purple-100',
  [Category.Dunya]: 'bg-yellow-500 text-yellow-100',
};

export const NewsCard: React.FC<NewsCardProps> = ({ article, onClick, isLiked, onLikeToggle }) => {

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Kartın tıklanma olayını tetiklemeyi önle
    onLikeToggle(article.id);
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="relative">
        <img className="w-full h-48 object-cover" src={article.imageUrl} alt={article.headline} />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow mb-4">
          <h2 className="text-xl font-bold mb-2 text-gray-100 leading-tight hover:text-cyan-400 cursor-pointer">
            {article.headline}
          </h2>
          <p className="text-gray-400 text-base">
            {article.summary}
          </p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700">
           <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[article.category] || 'bg-gray-500 text-gray-100'}`}>
            {article.category}
          </span>
          <button
            onClick={handleLikeClick}
            aria-label={isLiked ? 'Beğenmekten vazgeç' : 'Beğen'}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};