import { sanityClient } from "@/lib/sanity";
import Link from "next/link";

async function getAllSeoGenPosts() {
  // Only show published posts; sort by dateModified or datePublished
  const query = `
    *[_type == "seoGenPost"] | order(dateModified desc) {
      title,
      slug,
      excerpt,
      mainImage,
      dateModified
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