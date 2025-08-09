import { sanityClient } from "@/lib/sanity";
import Link from "next/link";

interface ViatorPost {
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  mainImage?: string;
  dateModified?: string;
  postType?: string;
  category?: string[];
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

async function getViatorSeoGenPosts(page: number = 1, postsPerPage: number = 12): Promise<{ posts: ViatorPost[], total: number }> {
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage - 1;
  
  // Query for seoGenPostViator documents (the correct document type for Viator posts)
  const query = `
    {
      "posts": *[_type == "seoGenPostViator"] | order(dateModified desc) [${start}...${end}] {
        title,
        slug,
        excerpt,
        mainImage,
        dateModified,
        postType,
        category
      },
      "total": count(*[_type == "seoGenPostViator"])
    }
  `;
  return await sanityClient.fetch(query);
}

export default async function ViatorSeoPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const postsPerPage = 12;
  const { posts, total } = await getViatorSeoGenPosts(currentPage, postsPerPage);
  
  const totalPages = Math.ceil(total / postsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-4 text-center">SEO Gen Post (Viator)</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Discover our curated collection of Viator travel experiences and tours
        </p>
        
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500">
            Showing {posts.length} of {total.toLocaleString()} posts 
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>
        
        {posts.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: ViatorPost) => (
                <Link
                  key={post.slug.current}
                  href={`/${post.slug.current}`}
                  className="block bg-white shadow-lg rounded-xl overflow-hidden hover:scale-[1.02] transition"
                >
                  {post.mainImage && (
                    <img
                      src={post.mainImage}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h2>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-3 text-sm line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.category && post.category.map((cat, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      Last updated:{" "}
                      {post.dateModified
                        ? new Date(post.dateModified).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-4">
                {hasPrevPage && (
                  <Link
                    href={`/tools/viator-seo?page=${currentPage - 1}`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Previous
                  </Link>
                )}
                
                <div className="flex space-x-2">
                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <Link
                        href="/tools/viator-seo?page=1"
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        1
                      </Link>
                      {currentPage > 4 && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}
                    </>
                  )}
                  
                  {/* Show current page and adjacent pages */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Link
                        key={pageNum}
                        href={`/tools/viator-seo?page=${pageNum}`}
                        className={`px-3 py-2 border rounded-lg ${
                          pageNum === currentPage
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                  
                  {/* Show last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}
                      <Link
                        href={`/tools/viator-seo?page=${totalPages}`}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        {totalPages}
                      </Link>
                    </>
                  )}
                </div>
                
                {hasNextPage && (
                  <Link
                    href={`/tools/viator-seo?page=${currentPage + 1}`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Viator posts found</h2>
            <p className="text-gray-600 mb-8">
              There are currently no SEO Gen Posts with Viator category or type in the system.
            </p>
            
            {/* Call-to-action section for Viator */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-indigo-600 rounded-2xl p-8 text-center text-white">
                <h3 className="text-xl font-bold mb-4">Explore Viator Experiences</h3>
                <p className="text-sm mb-6">Browse thousands of curated travel experiences worldwide</p>
                <a
                  href="https://www.viator.com"
                  target="_blank"
                  rel="noopener sponsored"
                  className="inline-block bg-white text-indigo-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Visit Viator
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: "SEO Gen Post (Viator) - Travel Experiences Archive | STR Specialist",
  description: "Browse our collection of Viator travel experiences and SEO-optimized posts. Find curated recommendations for tours, activities, and unique local experiences worldwide.",
  keywords: "Viator, travel experiences, tours, activities, travel booking, vacation planning, SEO posts"
};