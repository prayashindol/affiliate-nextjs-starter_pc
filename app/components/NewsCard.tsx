import { NewsArticle } from '@/lib/types/news';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'compact';
  showImage?: boolean;
}

export function NewsCard({ article, variant = 'default', showImage = true }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isCompact = variant === 'compact';

  return (
    <article className={`
      bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200
      ${isCompact ? 'h-full' : ''}
    `}>
      {showImage && article.image && (
        <div className={`relative ${isCompact ? 'h-32' : 'h-48'} overflow-hidden`}>
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
            priority={!isCompact}
          />
        </div>
      )}
      
      <div className={`p-4 ${isCompact ? 'space-y-2' : 'space-y-3'}`}>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
            {article.source}
          </span>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            <time dateTime={article.published_at}>
              {formatDate(article.published_at)}
            </time>
          </div>
        </div>
        
        <h3 className={`font-semibold text-gray-900 leading-tight ${
          isCompact ? 'text-sm line-clamp-2' : 'text-lg line-clamp-3'
        }`}>
          {article.title}
        </h3>
        
        {article.description && (
          <p className={`text-gray-600 leading-relaxed ${
            isCompact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'
          }`}>
            {article.description}
          </p>
        )}
        
        <div className="pt-2">
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors
              ${isCompact ? 'text-xs' : 'text-sm'}
            `}
          >
            Read more
            <ArrowTopRightOnSquareIcon className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </Link>
        </div>
      </div>
    </article>
  );
}
