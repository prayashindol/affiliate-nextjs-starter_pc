import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlogService } from '@/lib/services/blog';
import { BlogPost } from '@/lib/types/blog';
import { CalendarDaysIcon, ClockIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { BlogCard } from '@/app/components/BlogCard';
import { ScrollToTopButton } from '@/app/components/ScrollToTopButton';

// Post navigation component
function PostNavigation({ previousPost, nextPost }: {
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}) {
  if (!previousPost && !nextPost) return null;

  return (
    <div className="border-t border-gray-200 pt-8 mt-12">
      <div className="flex justify-between items-center">
        {previousPost ? (
          <Link 
            href={`/blog/${previousPost.slug}`}
            className="flex items-center space-x-3 text-left hover:text-indigo-600 transition-colors max-w-sm"
          >
            <ChevronLeftIcon className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Previous Post</p>
              <p className="font-medium line-clamp-2">{previousPost.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextPost ? (
          <Link 
            href={`/blog/${nextPost.slug}`}
            className="flex items-center space-x-3 text-right hover:text-indigo-600 transition-colors max-w-sm"
          >
            <div>
              <p className="text-sm text-gray-500">Next Post</p>
              <p className="font-medium line-clamp-2">{nextPost.title}</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 flex-shrink-0" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Get the blog post
  const post = await BlogService.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get navigation posts
  const navigation = await BlogService.getPostNavigation(slug);

  // Get related posts
  const relatedPosts = await BlogService.getRelatedPosts(post.id, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="text-indigo-200 hover:text-white">
                    Home
                  </Link>
                </li>
                <li className="text-indigo-200">/</li>
                <li>
                  <Link href="/blog" className="text-indigo-200 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li className="text-indigo-200">/</li>
                <li className="text-white">{post.title}</li>
              </ol>
            </nav>

            {/* Category */}
            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-indigo-100">
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
                <span>{post.author.name}</span>
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
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="w-full h-96 bg-gray-100">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Post Navigation */}
          <PostNavigation
            previousPost={navigation.previousPost}
            nextPost={navigation.nextPost}
          />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard
                    key={relatedPost.id}
                    post={relatedPost}
                    variant="default"
                    showImage={true}
                    showAuthor={true}
                    showCategory={true}
                    showReadTime={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}

// Generate static params for better performance
export async function generateStaticParams() {
  const posts = await BlogService.getAllPosts({ limit: 50 });
  return posts.posts.map((post) => ({
    slug: post.slug,
  }));
}

// Add metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await BlogService.getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author.name],
    },
  };
}