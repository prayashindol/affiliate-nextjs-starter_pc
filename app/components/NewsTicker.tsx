import { GoogleNewsRSSService } from '@/lib/services/google-news-rss';
import { NewsCard } from './NewsCard';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export async function NewsTicker() {
  const newsResponse = await GoogleNewsRSSService.getLatestNews(6);
  const articles = newsResponse.data || [];

  if (articles.length === 0) {
    return null; // Don't render anything if no news available
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Latest Industry News
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Stay updated with the latest trends and developments in short-term rentals
          </p>
        </div>
        
        {/* News Grid - 3x2 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.slice(0, 6).map((article, index) => (
            <NewsCard
              key={`${article.url}-${index}`}
              article={article}
              variant="compact"
              showImage={true}
            />
          ))}
        </div>
        
        {/* See More Button */}
        <div className="text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            View All Industry News
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}