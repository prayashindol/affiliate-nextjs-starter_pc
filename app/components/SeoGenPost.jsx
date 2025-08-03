import React from "react";

export default function SeoGenPost({ post }) {
  return (
    <article className="max-w-3xl mx-auto my-8 bg-white shadow-xl rounded-2xl p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{post.title}</h1>
      
      {/* Meta */}
      <div className="flex flex-wrap items-center mb-6 text-gray-500 text-sm gap-4">
        {post.location && (
          <span>
            <span className="font-semibold">Location:</span> {post.location}
          </span>
        )}
        {post.dateModified && (
          <span>
            <span className="font-semibold">Last updated:</span>{" "}
            {new Date(post.dateModified).toLocaleDateString()}
          </span>
        )}
        {post.author && (
          <span>
            <span className="font-semibold">Author:</span> {post.author}
          </span>
        )}
      </div>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-lg text-gray-700 mb-6 italic">{post.excerpt}</p>
      )}

      {/* Main Image */}
      {post.mainImage && (
        <img
          src={post.mainImage}
          alt={post.title}
          className="w-full rounded-xl shadow mb-8"
        />
      )}

      {/* Main Content (HTML from Sanity, so be careful!) */}
      {post.contentHtml && (
        <div
          className="prose prose-lg max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      )}

      {/* Description / CTA */}
      {post.description && (
        <div className="my-8 p-6 bg-blue-50 rounded-xl text-blue-900 text-center font-semibold">
          {post.description}
        </div>
      )}

      {/* Permalink (if you want to show it) */}
      {post.permalink && (
        <a
          href={post.permalink}
          className="block mt-8 text-blue-600 underline text-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Original Permalink
        </a>
      )}
    </article>
  );
}
