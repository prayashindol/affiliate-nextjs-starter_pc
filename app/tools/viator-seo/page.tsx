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
  category?: string;
}

async function getViatorSeoGenPosts(): Promise<ViatorPost[]> {
  // Query for posts with postType containing "Viator" or category containing "Viator"
  const query = `
    *[_type == "seoGenPost" && (
      postType match "*Viator*" || 
      category match "*Viator*" || 
      postType == "SEO Gen Post (Viator)" ||
      category == "SEO Gen Post (Viator)"
    )] | order(dateModified desc) {
      title,
      slug,
      excerpt,
      mainImage,
      dateModified,
      postType,
      category
    }
  `;
  return await sanityClient.fetch(query);
}

export default async function ViatorSeoPage() {
  const posts = await getViatorSeoGenPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">SEO Gen Post (Viator)</h1>
        <p className="text-lg text-gray-600 mb-12 text-center">
          Discover our curated collection of Viator travel experiences and tours
        </p>
        
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
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
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-2">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.postType && (
                      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                        {post.postType}
                      </span>
                    )}
                    {post.category && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {post.category}
                      </span>
                    )}
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