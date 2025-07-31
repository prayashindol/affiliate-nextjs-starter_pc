'use client';

import Link from 'next/link';
import { BlogPost } from '@/lib/types/blog';
import { CalendarDaysIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import FavoriteButton from './FavoriteButton';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact' | 'featured';
  showImage?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
  showReadTime?: boolean;
}

export function BlogCard({ 
  post, 
  variant = 'default',
  showImage = true,
  showAuthor = true,
  showCategory = true,
  showReadTime = true
}: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const baseClasses = "bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200";
  
  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className={`${baseClasses} p-4 block`}>
        <div className="flex gap-4">
          {showImage && post.featured_image && (
            <div className="flex-shrink-0">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-16 h-16 object-cover rounded-md"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
              {post.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <CalendarDaysIcon className="h-3 w-3" />
                {formatDate(post.published_at)}
              </span>
              {showReadTime && post.read_time && (
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  {post.read_time} min
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`${baseClasses} overflow-hidden relative`}>
        <Link href={`/blog/${post.slug}`} className="block">
          {showImage && post.featured_image && (
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <FavoriteButton 
                  item={{
                    id: post.slug,
                    title: post.title,
                    type: 'post',
                    url: `/blog/${post.slug}`
                  }}
                />
              </div>
            </div>
          )}
          <div className="p-6">
            {showCategory && (
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full mb-3">
                {post.category}
              </span>
            )}
            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {showAuthor && (
                  <span className="flex items-center gap-2">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                  {post.author.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <CalendarDaysIcon className="h-4 w-4" />
                {formatDate(post.published_at)}
              </span>
            </div>
            {showReadTime && post.read_time && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <ClockIcon className="h-4 w-4" />
                {post.read_time} min read
              </span>
            )}
          </div>
        </div>
        </Link>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`${baseClasses} overflow-hidden relative`}>
      <Link href={`/blog/${post.slug}`} className="block">
        {showImage && post.featured_image && (
          <div className="aspect-w-16 aspect-h-9 relative">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
              <FavoriteButton 
                item={{
                  id: post.slug,
                  title: post.title,
                  type: 'post',
                  url: `/blog/${post.slug}`
                }}
              />
            </div>
          </div>
        )}
        <div className="p-6">
          {showCategory && (
            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full mb-3">
              {post.category}
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {showAuthor && (
              <span className="flex items-center gap-2">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <UserIcon className="h-4 w-4" />
                )}
                {post.author.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarDaysIcon className="h-4 w-4" />
              {formatDate(post.published_at)}
            </span>
            {showReadTime && post.read_time && (
              <span className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {post.read_time} min
              </span>
            )}
        </div>
      </div>
      </Link>
    </div>
  );
}