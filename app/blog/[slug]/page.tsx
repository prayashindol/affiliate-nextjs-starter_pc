'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/types/blog';
import { CalendarDaysIcon, ClockIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { BlogCard } from '../../components/BlogCard';
import { BlogService } from '@/lib/services/blog';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSlugAndFetch = async () => {
      const resolvedParams = await params;
      fetchPost(resolvedParams.slug);
    };
    getSlugAndFetch();
  }, [params]);

  const fetchPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/blog/${postSlug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Blog post not found');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }
      
      const postData: BlogPost = await response.json();
      setPost(postData);

      // Fetch related posts
      const related = await BlogService.getRelatedPosts(postData.id);
      setRelatedPosts(related);
    } catch (err) {
      setError('Failed to load blog post. Please try again later.');
      console.error('Error fetching blog post:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Blog post not found'}
            </h1>
            <p className="text-gray-600 mb-8">
              {error === 'Blog post not found' 
                ? 'The blog post you\'re looking for doesn\'t exist.' 
                : 'Something went wrong while loading the blog post.'}
            </p>
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back to Blog Link */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Category */}
          <div className="mb-4">
            <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <UserIcon className="h-6 w-6" />
              )}
              <span className="font-medium">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-5 w-5" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            {post.read_time && (
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span>{post.read_time} min read</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard
                  key={relatedPost.id}
                  post={relatedPost}
                  variant="compact"
                  showImage={true}
                  showAuthor={false}
                  showCategory={true}
                  showReadTime={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}