import React, { useEffect } from 'react';
import { NewsArticle, Category } from '../types';

interface NewsDetailModalProps {
  article: NewsArticle;
  onClose: () => void;
}

const categoryColors: Record<Category, string> = {
  [Category.Gundem]: 'border-blue-500',
  [Category.Ekonomi]: 'border-green-500',
  [Category.Spor]: 'border-red-500',
  [Category.Teknoloji]: 'border-purple-500',
  [Category.Dunya]: 'border-yellow-500',
};

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose }) => {
    
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 modal-enter-active"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-title"
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2">
            <img src={article.imageUrl} alt={article.headline} className="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none" />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col">
            <div className="flex-grow">
                <span className={`text-sm font-bold uppercase tracking-wider mb-2 block ${categoryColors[article.category]?.replace('border-', 'text-') || 'text-gray-400'}`}>
                    {article.category}
                </span>
                <h1 id="news-title" className="text-3xl font-bold text-white mb-4">
                    {article.headline}
                </h1>
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                    {article.content}
                </p>
            </div>
            <div className="mt-6 text-right">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
                    aria-label="Haberi kapat"
                >
                    Kapat
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
