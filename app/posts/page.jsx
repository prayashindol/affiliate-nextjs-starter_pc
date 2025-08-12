import { sanityClient } from "@/lib/sanity";
import Link from "next/link";
import { isSeoGenByCategories, isViatorByCategories } from "@/lib/postKinds";

async function getAllSeoGenPosts() {
  // Query for SEO gen posts, both regular and Viator types
  // Include both seoGenPost and seoGenPostViator types as they're used in the dynamic page
  const query = `
    *[_type in ["seoGenPost", "seoGenPostViator"] && 
      defined(title) && 
      defined(contentHtml) && 
      length(contentHtml) > 0
    ] | order(dateModified desc) {
      title,
      slug,
      excerpt,
      mainImage,
      dateModified,
      _type,
      categories[]->{title, slug},
      category
    }
  `;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Failed to fetch posts from Sanity:', error);
    // Return empty array if Sanity is unavailable (e.g., in development with test credentials)
    return [];
  }
}

export default async function PostsListingPage() {
  const allPosts = await getAllSeoGenPosts();
  
  // Filter to show only airbnb-gen posts but exclude Viator posts
  const posts = allPosts.filter(post => {
    // Check if it's a regular SEO gen post (airbnb-gen) but not a Viator post
    const isSeoGen = isSeoGenByCategories(post.categories) || 
                     (Array.isArray(post.category) && post.category.includes('airbnb-gen'));
    const isViator = isViatorByCategories(post.categories) || 
                     (Array.isArray(post.category) && post.category.includes('airbnb-gen-viator')) ||
                     post._type === 'seoGenPostViator';
    
    return isSeoGen && !isViator;
  });

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">All Posts</h1>
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No airbnb-gen posts found.</p>
          <p className="text-gray-500 text-sm">
            This could be due to authentication issues or no posts matching the criteria.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
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
      )}
    </div>
  );
}