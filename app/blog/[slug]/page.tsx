import { notFound } from 'next/navigation';
import { WordPressService } from '@/lib/services/wordpress';
import { BlogPost } from '@/lib/types/wordpress';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    return await WordPressService.getPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getRecentPosts(): Promise<BlogPost[]> {
  try {
    return await WordPressService.getRecentPosts(5);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    notFound();
  }

  const recentPosts = await getRecentPosts();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back to Blog Link */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      <article className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span>By {post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              {post.date !== post.modified && (
                <div className="text-sm text-gray-500">
                  Updated: {formatDate(post.modified)}
                </div>
              )}
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative h-64 md:h-96 lg:h-[500px] rounded-lg overflow-hidden mb-8">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                  priority
                />
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div 
                className="prose prose-lg max-w-none prose-indigo
                  prose-headings:text-gray-900 
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900
                  prose-ul:text-gray-700
                  prose-ol:text-gray-700
                  prose-blockquote:border-indigo-200 prose-blockquote:text-gray-600
                  prose-img:rounded-lg prose-img:shadow-md
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Recent Posts */}
                {recentPosts.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                    <div className="space-y-4">
                      {recentPosts
                        .filter(p => p.id !== post.id) // Don't show current post
                        .slice(0, 4)
                        .map((recentPost) => (
                        <article key={recentPost.id} className="group">
                          <Link href={`/blog/${recentPost.slug}`}>
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2 mb-1">
                              {recentPost.title}
                            </h4>
                            <time className="text-xs text-gray-500">
                              {formatDate(recentPost.date)}
                            </time>
                          </Link>
                        </article>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link 
                        href="/blog"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        View all posts →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | STR Specialist Blog',
    };
  }

  // Clean excerpt for meta description
  const cleanExcerpt = post.excerpt.replace(/<[^>]*>/g, '').trim();

  return {
    title: `${post.title} | STR Specialist Blog`,
    description: cleanExcerpt || `Read ${post.title} on STR Specialist Blog`,
    openGraph: {
      title: post.title,
      description: cleanExcerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author],
    },
  };
}