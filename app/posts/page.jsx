import { sanityClient } from "@/lib/sanity";
import Link from "next/link";
import { CATEGORY_SLUGS } from "@/lib/postKinds";

async function getAllSeoGenPosts() {
  // Debug: Check what content exists for seoGenPost type
  const debugSeoGenQuery = `
    *[_type == "seoGenPost"] {
      title,
      slug,
      excerpt,
      mainImage,
      dateModified,
      _type,
      "hasContentHtml": defined(contentHtml),
      "contentLength": length(contentHtml),
      categories[]->{title, slug}
    }
  `;
  
  const debugPosts = await sanityClient.fetch(debugSeoGenQuery);
  console.log('Debug - All seoGenPost posts (regardless of content):', JSON.stringify(debugPosts, null, 2));
  
  // Less restrictive query for seoGenPost - just require title
  const relaxedQuery = `
    *[_type == "seoGenPost" && defined(title)] | order(dateModified desc) {
      title,
      slug,
      excerpt,
      mainImage,
      dateModified,
      _type,
      categories[]->{title, slug}
    }
  `;
  
  let posts = await sanityClient.fetch(relaxedQuery);
  console.log('Debug - Relaxed query (seoGenPost with just title):', posts.length, 'posts found');
  
  if (posts.length > 0) {
    return posts;
  }
  
  // If still no results, try to find the one seoGenPost I saw in the debug data
  const allPostsQuery = `
    *[_type in ["seoGenPost", "seoGenPostViator"]] {
      title,
      slug,
      excerpt,
      mainImage,
      dateModified,
      _type,
      "hasContentHtml": defined(contentHtml),
      "contentLength": length(contentHtml),
      categories[]->{title, slug}
    } | order(_type asc, dateModified desc)
  `;
  
  const allPosts = await sanityClient.fetch(allPostsQuery);
  console.log('Debug - All posts by type:', JSON.stringify(allPosts.slice(0, 10), null, 2));
  
  // Return only seoGenPost type posts, regardless of content
  const seoGenPosts = allPosts.filter(post => post._type === 'seoGenPost');
  console.log('Debug - Filtered seoGenPost posts:', seoGenPosts.length);
  
  return seoGenPosts;
}

export default async function PostsListingPage() {
  const posts = await getAllSeoGenPosts();

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">All Posts</h1>
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
    </div>
  );
}