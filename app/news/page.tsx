'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { NewsArticle } from '@/lib/types/news';
import { ErrorBoundary, NewsErrorFallback } from '../components/ErrorBoundary';

// Dynamic imports to reduce initial bundle size
const NewsCard = dynamic(() => import('../components/NewsCard').then(mod => ({ default: mod.NewsCard })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>,
  ssr: false
});

const ChevronLeftIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => ({ default: mod.ChevronLeftIcon })), {
  loading: () => <div className="h-4 w-4"></div>,
  ssr: false
});

const ChevronRightIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => ({ default: mod.ChevronRightIcon })), {
  loading: () => <div className="h-4 w-4"></div>,
  ssr: false
});

function NewsPageContent() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const articlesPerPage = 20;
  const maxRetries = 3;

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const fetchNews = async (page: number, retry = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`/api/news?page=${page}&limit=${articlesPerPage}`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setArticles(data.data || []);
      setTotalPages(Math.ceil((data.pagination?.total || 0) / articlesPerPage));
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error fetching news:', err);
      
      if (retry < maxRetries) {
        setRetryCount(retry + 1);
        // Exponential backoff: wait 1s, 2s, 4s before retrying
        const delay = Math.pow(2, retry) * 1000;
        setTimeout(() => fetchNews(page, retry + 1), delay);
        setError(`Loading news... (attempt ${retry + 1}/${maxRetries + 1})`);
      } else {
        setError('Failed to load news. Please try refreshing the page.');
        setRetryCount(0);
      }
    } finally {
      if (retry === 0) { // Only set loading to false on final attempt
        setLoading(false);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchNews(currentPage);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Industry News
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
            Stay informed with the latest news and trends in short-term rentals, Airbnb, VRBO, and the vacation rental industry
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              {retryCount === 0 && (
                <button
                  onClick={handleRetry}
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">
              {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : 'Loading latest news...'}
            </p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No news articles found at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later for the latest industry updates.</p>
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>}>
                {articles.map((article, index) => (
                  <NewsCard
                    key={`${article.url}-${index}`}
                    article={article}
                    variant="default"
                    showImage={true}
                  />
                ))}
              </Suspense>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Suspense fallback={<div className="w-20 h-10 bg-gray-200 rounded"></div>}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                </Suspense>

                {getVisiblePages().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    disabled={page === '...'}
                    className={`px-3 py-2 rounded-lg font-medium ${
                      page === currentPage
                        ? 'bg-indigo-600 text-white'
                        : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <Suspense fallback={<div className="w-16 h-10 bg-gray-200 rounded"></div>}>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </Suspense>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <ErrorBoundary fallback={NewsErrorFallback}>
      <NewsPageContent />
    </ErrorBoundary>
  );
}