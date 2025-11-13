import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NewsArticle, Category } from './types';
import { fetchNews } from './services/geminiService';
import { Header } from './components/Header';
import { NewsCard } from './components/NewsCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { CategoryFilter } from './components/CategoryFilter';
import { Pagination } from './components/Pagination';
import { NewsDetailModal } from './components/NewsDetailModal';

const NEWS_PER_PAGE = 20;

const App: React.FC = () => {
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all' | 'liked'>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [likedNewsIds, setLikedNewsIds] = useState<Set<string>>(new Set());

  // Load liked news from localStorage on initial render
  useEffect(() => {
    try {
      const storedLikedIds = localStorage.getItem('liked-news-ids');
      if (storedLikedIds) {
        setLikedNewsIds(new Set(JSON.parse(storedLikedIds)));
      }
    } catch (e) {
      console.error("localStorage'dan beğenilen haberler okunamadı", e);
    }
  }, []);

  // Persist liked news to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('liked-news-ids', JSON.stringify(Array.from(likedNewsIds)));
    } catch (e) {
      console.error("localStorage'a beğenilen haberler yazılamadı", e);
    }
  }, [likedNewsIds]);


  const handleToggleLike = useCallback((articleId: string) => {
    setLikedNewsIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(articleId)) {
        newIds.delete(articleId);
      } else {
        newIds.add(articleId);
      }
      return newIds;
    });
  }, []);

  const loadNews = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const newNewsData = await fetchNews();
      setAllNews(prevNews => {
        const existingHeadlines = new Map(prevNews.map(n => [n.headline, true]));
        const uniqueNewArticles = newNewsData.filter(n => !existingHeadlines.has(n.headline));
        return [...uniqueNewArticles, ...prevNews];
      });
      setLastUpdated(new Date());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Bilinmeyen bir hata oluştu.');
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    try {
      const storedNews = localStorage.getItem('news-data');
      if (storedNews) {
        setAllNews(JSON.parse(storedNews));
        setLastUpdated(new Date(localStorage.getItem('news-last-updated') || Date.now()));
        setLoading(false);
      } else {
        setLoading(true);
        fetchNews().then(initialNews => {
            setAllNews(initialNews);
            setLastUpdated(new Date());
        }).catch(err => {
            if (err instanceof Error) setError(err.message);
            else setError('Bilinmeyen bir hata oluştu.');
        }).finally(() => setLoading(false));
      }
    } catch (e) {
        console.error("localStorage'dan veri okunamadı", e);
        setLoading(false);
        setError("Kaydedilmiş haberler yüklenemedi.");
    }
  }, []); // fetchNews dependency removed to prevent re-fetching on like toggle

  useEffect(() => {
    try {
        localStorage.setItem('news-data', JSON.stringify(allNews));
        if (lastUpdated) {
            localStorage.setItem('news-last-updated', lastUpdated.toISOString());
        }
    } catch (e) {
        console.error("localStorage'a veri yazılamadı", e);
    }
  }, [allNews, lastUpdated]);

  const filteredNews = useMemo(() => {
    setCurrentPage(1); // Filtre değiştiğinde 1. sayfaya dön
    if (selectedCategory === 'all') {
      return allNews;
    }
    if (selectedCategory === 'liked') {
        return allNews.filter(article => likedNewsIds.has(article.id));
    }
    return allNews.filter(article => article.category === selectedCategory);
  }, [selectedCategory, allNews, likedNewsIds]);
  
  const totalPages = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
  const paginatedNews = useMemo(() => {
      const startIndex = (currentPage - 1) * NEWS_PER_PAGE;
      const endIndex = startIndex + NEWS_PER_PAGE;
      return filteredNews.slice(startIndex, endIndex);
  }, [currentPage, filteredNews]);


  const renderContent = () => {
    if (loading) {
      return (
        <div>
          <p className="text-center text-gray-400 mb-4">Kaydedilmiş haberler aranıyor...</p>
          <LoadingSpinner />
        </div>
      );
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (paginatedNews.length === 0) {
      return <p className="text-center text-gray-400 mt-8">Bu kategoride gösterilecek haber bulunamadı.</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedNews.map((article) => (
          <NewsCard 
            key={article.id} 
            article={article} 
            onClick={() => setSelectedArticle(article)} 
            isLiked={likedNewsIds.has(article.id)}
            onLikeToggle={handleToggleLike}
            />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <p className="text-sm text-gray-500 whitespace-nowrap">
                Son Güncelleme: {lastUpdated.toLocaleTimeString('tr-TR')}
              </p>
            )}
            <button
              onClick={loadNews}
              disabled={isRefreshing}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-full flex items-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V4a1 1 0 011-1zm12 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
              {isRefreshing ? 'Yenileniyor...' : 'Yenile'}
            </button>
          </div>
        </div>
        {renderContent()}
        {totalPages > 1 && !loading && (
             <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </main>
      {selectedArticle && (
        <NewsDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
};

export default App;