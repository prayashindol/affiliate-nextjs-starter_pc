import { BlogPost } from '@/lib/types/wordpress';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact';
  showImage?: boolean;
}

export function BlogCard({ post, variant = 'default', showImage = true }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isCompact = variant === 'compact';

  // Clean excerpt HTML
  const cleanExcerpt = post.excerpt.replace(/<[^>]*>/g, '').trim();

  return (
    <article className={`
      bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200
      ${isCompact ? 'h-full' : ''}
    `}>
      {showImage && post.featuredImage && (
        <div className={`relative ${isCompact ? 'h-32' : 'h-48'} overflow-hidden`}>
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes={isCompact ? "300px" : "400px"}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className={`p-4 ${isCompact ? 'space-y-2' : 'space-y-3'}`}>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {post.categories.length > 0 && (
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
              {post.categories[0]}
            </span>
          )}
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            <time dateTime={post.date}>
              {formatDate(post.date)}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
        </div>
        
        <h3 className={`font-semibold text-gray-900 leading-tight ${
          isCompact ? 'text-sm line-clamp-2' : 'text-lg line-clamp-3'
        }`}>
          {post.title}
        </h3>
        
        {cleanExcerpt && (
          <p className={`text-gray-600 leading-relaxed ${
            isCompact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'
          }`}>
            {cleanExcerpt}
          </p>
        )}
        
        <div className="pt-2">
          <Link
            href={`/blog/${post.slug}`}
            className={`
              inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors
              ${isCompact ? 'text-xs' : 'text-sm'}
            `}
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}