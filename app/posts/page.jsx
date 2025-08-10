import { sanityClient } from "@/lib/sanity";
import Link from "next/link";

async function getAllSeoGenPosts() {
  // Include both seoGenPost and seoGenPostViator types
  // Filter out posts with empty/incomplete content
  const query = `
    *[_type in ["seoGenPost", "seoGenPostViator"] && 
      defined(title) && 
      defined(slug.current) && 
      defined(contentHtml) && 
      length(contentHtml) > ${MIN_CONTENT_LENGTH} &&
      !(!defined(excerpt) && !defined(description))
    ] | order(dateModified desc, datePublished desc) {
      title,
      slug,
      excerpt,
      description,
      mainImage,
      dateModified,
      datePublished,
      _type,
      city
    }
  `;
  return await sanityClient.fetch(query);
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
              <p className="text-gray-600 mb-2">{post.excerpt || post.description}</p>
              {post.city && (
                <p className="text-sm text-indigo-600 mb-2">📍 {post.city}</p>
              )}
              <p className="text-xs text-gray-400">
                Last updated:{" "}
                {post.dateModified
                  ? new Date(post.dateModified).toLocaleDateString()
                  : post.datePublished
                  ? new Date(post.datePublished).toLocaleDateString() 
                  : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}