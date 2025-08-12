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
    const posts = await sanityClient.fetch(query);
    console.log('Fetched posts from Sanity:', posts.length);
    
    // If Sanity is connected but returns no posts, use mock data for development
    if (posts.length === 0) {
      console.log('No posts found in Sanity, using mock data for development');
      // Return some mock data for development when Sanity has no posts
      // This helps demonstrate the functionality without requiring real data
      const mockPosts = [
      {
        title: "Ultimate Airbnb Host Guide 2024",
        slug: { current: "ultimate-airbnb-host-guide-2024" },
        excerpt: "Complete guide to becoming a successful Airbnb host with proven strategies and tips.",
        mainImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
        dateModified: "2024-01-15T00:00:00Z",
        _type: "seoGenPost",
        categories: [{ title: "SEO Gen Post", slug: { current: "airbnb-gen" } }],
        category: ["airbnb-gen"]
      },
      {
        title: "Maximizing Your Airbnb Revenue",
        slug: { current: "maximizing-airbnb-revenue" },
        excerpt: "Learn proven strategies to increase your Airbnb earnings and optimize your listing performance.",
        mainImage: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400",
        dateModified: "2024-01-10T00:00:00Z",
        _type: "seoGenPost",
        categories: [{ title: "SEO Gen Post", slug: { current: "airbnb-gen" } }],
        category: ["airbnb-gen"]
      },
      {
        title: "Airbnb Photography Tips for Hosts",
        slug: { current: "airbnb-photography-tips" },
        excerpt: "Professional photography tips to make your Airbnb listing stand out and attract more guests.",
        mainImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
        dateModified: "2024-01-05T00:00:00Z",
        _type: "seoGenPost",
        categories: [{ title: "SEO Gen Post", slug: { current: "airbnb-gen" } }],
        category: ["airbnb-gen"]
      }
    ];
    
    console.log('Using mock data for development:', mockPosts.length, 'posts');
    return mockPosts;
    }
    
    return posts;
  } catch (error) {
    console.error('Failed to fetch posts from Sanity:', error);
    
    // Return some mock data for development when Sanity is unavailable
    // This helps demonstrate the functionality without requiring real Sanity credentials
    const mockPosts = [
      {
        title: "Ultimate Airbnb Host Guide 2024 (Error Fallback)",
        slug: { current: "ultimate-airbnb-host-guide-2024-fallback" },
        excerpt: "Complete guide to becoming a successful Airbnb host with proven strategies and tips.",
        mainImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
        dateModified: "2024-01-15T00:00:00Z",
        _type: "seoGenPost",
        categories: [{ title: "SEO Gen Post", slug: { current: "airbnb-gen" } }],
        category: ["airbnb-gen"]
      }
    ];
    
    console.log('Using mock data for development (error fallback):', mockPosts.length, 'posts');
    return mockPosts;
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