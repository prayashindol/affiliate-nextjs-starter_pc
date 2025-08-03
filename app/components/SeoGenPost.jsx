import React from "react";
import { load } from "cheerio";

function cleanContentHtml(html, mainImage, permalink) {
  const $ = load(html || "");

  // Remove first H1
  $("h1").first().remove();

  // Remove the first two <p> tags (usually category/location)
  $("p").slice(0, 2).remove();

  // Remove the first <ul>
  $("ul").first().remove();

  // Remove the first <p> with affiliate/disclosure
  $("p").filter((i, el) => {
    const text = $(el).text().toLowerCase();
    return text.includes("affiliate") || text.includes("disclosure");
  }).first().remove();

  // Remove all inline styles and class attributes
  $('[style]').removeAttr('style');
  $('[class]').removeAttr('class');

  // --- PROFESSIONAL TABLE STYLING WITH CENTERED TEXT ---
  // Wrap each table for horizontal scrolling on mobile
  $("table").each((i, el) => {
    $(el).wrap('<div class="overflow-x-auto"></div>');
  });
  // Table/card appearance, CENTERED alignment
  $("table").addClass("min-w-full mt-8 shadow-sm rounded-xl overflow-hidden bg-white border border-gray-200");
  $("th").addClass("bg-gray-100 text-gray-900 px-6 py-4 text-center font-semibold text-base first:rounded-tl-xl last:rounded-tr-xl");
  $("td").addClass("px-6 py-4 border-t border-gray-200 text-gray-800 align-top text-center");
  $("tr").addClass("odd:bg-gray-50 hover:bg-indigo-50 transition-colors");
  $("tr:last-child td:first-child").addClass("rounded-bl-xl");
  $("tr:last-child td:last-child").addClass("rounded-br-xl");
  // (Removed right-align code)

  // --- Banner injection after section 6 ---
  const section6 = $("h2, h3, h4, h5").filter((i, el) =>
    $(el).text().trim().toLowerCase().startsWith("6. ready to simplify airbnb cleaning")
  ).first();

  const bannerHtml =
    mainImage && permalink
      ? `<div class="my-12 flex justify-center">
          <a href="${permalink}" target="_blank" rel="noopener sponsored">
            <img src="${mainImage}" alt="Sponsored banner" class="w-full max-w-3xl object-cover rounded-xl transition hover:shadow-lg" />
          </a>
        </div>`
      : "";

  if (section6.length) {
    const nextPara = section6.nextAll("p").first();
    if (nextPara.length) {
      nextPara.after(bannerHtml);
    } else {
      section6.after(bannerHtml);
    }
  } else {
    $.root().append(bannerHtml);
  }

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

      {/* Cleaned Content HTML, banner injected after section 6 */}
      {post.contentHtml && (
        <div
          className="prose prose-lg prose-indigo max-w-none mb-12"
          style={{ fontSize: "1.14rem", lineHeight: "2.1" }}
          dangerouslySetInnerHTML={{
            __html: cleanContentHtml(post.contentHtml, post.mainImage, post.permalink),
          }}
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
