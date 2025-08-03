import React from "react";
import cheerio from "cheerio";

function stripFirstH1(html) {
  // This works server-side and client-side!
  const $ = cheerio.load(html || "");
  $("h1").first().remove();
  return $.html();
}

export default function SeoGenPost({ post }) {
  return (
    <article className="max-w-4xl mx-auto py-12 px-4 sm:px-8 lg:px-0">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{post.title}</h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center text-gray-500 text-sm mb-8 gap-4">
        {post.location && (
          <span>
            <span className="font-semibold">Location:</span> {post.location}
          </span>
        )}
        {post.dateModified && (
          <span>
            <span className="font-semibold">Last updated:</span> {new Date(post.dateModified).toLocaleDateString()}
          </span>
        )}
        {post.author && (
          <span>
            <span className="font-semibold">Author:</span> {post.author}
          </span>
        )}
      </div>

      {/* Main Image */}
      {post.mainImage && (
        <img
          src={post.mainImage}
          alt={post.title}
          className="w-full max-h-[32rem] object-cover rounded-xl mb-10"
        />
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-2xl text-gray-600 font-light mb-10">{post.excerpt}</p>
      )}

      {/* Content HTML (robust H1 removal) */}
      {post.contentHtml && (
        <div
          className="prose prose-lg prose-indigo max-w-none mb-12"
          style={{ fontSize: "1.14rem", lineHeight: "2.1" }}
          dangerouslySetInnerHTML={{ __html: stripFirstH1(post.contentHtml) }}
        />
      )}

      {/* Callout / Description */}
      {post.description && (
        <div className="my-12 py-6 px-6 bg-indigo-50/60 rounded-xl text-indigo-900 font-semibold text-center text-lg">
          {post.description}
        </div>
      )}

      {/* Permalink Button */}
      {post.permalink && (
        <div className="flex justify-center mt-12">
          <a
            href={post.permalink}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Original Permalink
          </a>
        </div>
      )}
    </article>
  );
}
