import React from "react";
import { load } from "cheerio";
import { urlFor } from "../../lib/sanity";

function cleanContentHtml(html, mainImage, permalink) {
  const $ = load(html || "");

  // --- NEW: Clean up navigation, author box, lone links, and empty divs ---

  // Remove "Prev/Next" navigation footer block
  $('.nsg-adjacent-links, .nsg-adjacent-links-wrapper').remove();

  // Remove the entire navigation block and all its links in one shot!
$('.nsg-adjacent-links').remove();


  // Remove Elementor/WordPress author box widget
  $('.elementor-widget-author-box').remove();
  $('[data-widget_type="author-box.default"]').each(function () {
    $(this).closest('[data-element_type="widget"]').remove();
  });

  // Remove lone navigation links at the end (direct <a> children of body)
  $('body > a').each(function () {
    const linkText = $(this).text().toLowerCase();
    if (
      linkText.includes('previous') ||
      linkText.includes('next') ||
      linkText.includes('overview') ||
      linkText.includes('prev post') ||
      linkText.includes('next post')
    ) {
      $(this).remove();
    }
  });

  // Remove divs at the end of body that only contain links or brs (safety net)
  $('body > div').each(function () {
    const onlyLinks =
      $(this).children().length > 0 &&
      $(this)
        .children()
        .toArray()
        .every((el) => el.tagName === "a" || el.tagName === "br");
    if (onlyLinks) $(this).remove();
  });

  // Remove any empty divs left behind
  $('body div').each(function () {
    if ($(this).text().trim() === "" && $(this).children().length === 0) {
      $(this).remove();
    }
  });

  // --- Original cleaning and formatting rules ---

  $('[data-widget_type="image.default"]').each(function () {
    $(this).closest('[data-element_type="widget"]').remove();
  });

  $("body > a, body > img").remove();
  if (permalink) {
    $(`a[href="${permalink}"]`).closest("div").remove();
  }
  if (mainImage) {
    $(`img[src="${mainImage}"]`).each(function () {
      if ($(this).parent().is("a")) {
        $(this).parent().remove();
      } else {
        $(this).remove();
      }
    });
  }
  $("h1").first().remove();
  $("p").slice(0, 2).remove();
  $("ul").first().remove();
  $("p")
    .filter((i, el) => {
      const text = $(el).text().toLowerCase();
      return text.includes("affiliate") || text.includes("disclosure");
    })
    .first()
    .remove();

  $("[style]").removeAttr("style");
  $("[class]").removeAttr("class");

  $("table").each((tableIdx, table) => {
    $(table).wrap('<div class="overflow-x-auto"></div>');
    $(table).find("th").addClass("bg-indigo-50 text-indigo-900 px-6 py-5 text-left font-bold text-lg");
    $(table).find("td").addClass("px-6 py-5 border-t border-gray-200 text-gray-800 align-top text-base");
    $(table).find("tr").addClass("odd:bg-gray-50 hover:bg-indigo-50/40 transition-colors duration-150");
    $(table).find("tr:last-child td:first-child").addClass("rounded-bl-xl");
    $(table).find("tr:last-child td:last-child").addClass("rounded-br-xl");
  });

  return $("body").html();
}

export default function SeoGenPost({ post }) {
  console.log("********* SeoGenPost RENDERED *********");
  console.log("POST OBJECT:", post);
  console.log("POST TYPE:", post && post.postType);

  if (!post) {
    return <div>NO POST DATA</div>;
  }

  const mainImageUrl =
    post.mainImageAsset && post.mainImageAsset.asset
      ? urlFor(post.mainImageAsset).width(1200).height(630).fit("max").auto("format").url()
      : null;

  const mainImageAlt =
    post.mainImageAsset && post.mainImageAsset.alt
      ? post.mainImageAsset.alt
      : post.title;

  let cleanedHtml = "";
  if (post.contentHtml) {
    cleanedHtml = cleanContentHtml(post.contentHtml, mainImageUrl, post.permalink);
    if (typeof window === "undefined") {
      console.log("CLEANED HTML:", cleanedHtml);
    }
  }

  const bannersByType = {
    Cleaner: (
      <a
        href="https://strspecialist.com/recommends/turnoverbnb/"
        target="_blank"
        rel="noopener sponsored"
        style={{ outline: "none", border: "none", display: "inline-block" }}
      >
        <img
          src="https://ambassador-api.s3.amazonaws.com/uploads/marketing/26557/2023_07_18_21_32_24.png"
          alt="Turno"
          style={{
            border: 0,
            maxWidth: "100%",
            borderRadius: "1rem",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
            margin: "0 auto",
          }}
        />
      </a>
    ),
    // Add other post types if needed
  };

  const selectedBanner = bannersByType[post.postType] || null;
  console.log("selectedBanner:", selectedBanner);

  return (
    <article className="max-w-5xl mx-auto py-12 px-4 sm:px-8 lg:px-0">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight text-center">
        {post.title}
      </h1>
      {mainImageUrl && (
        <img
          src={mainImageUrl}
          alt={mainImageAlt}
          className="rounded-2xl shadow-lg my-8 w-full h-auto object-cover"
          loading="eager"
        />
      )}
      <div className="flex flex-wrap items-center text-gray-500 text-sm mb-8 gap-4">
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
      {post.contentHtml && (
        <div
          className="prose prose-lg prose-indigo max-w-none mb-12"
          style={{ fontSize: "1.14rem", lineHeight: "2.1" }}
          dangerouslySetInnerHTML={{
            __html: cleanedHtml,
          }}
        />
      )}
      {selectedBanner && (
        <div className="flex justify-center my-12">
          {selectedBanner}
        </div>
      )}
    </article>
  );
}
