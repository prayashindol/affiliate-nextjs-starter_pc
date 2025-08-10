import React from "react";
import { load } from "cheerio";
import { urlFor } from "../../lib/sanity";
import ViatorTours from "./ViatorTours";

function cleanContentHtml(html, mainImage, permalink) {
  // --- NEW: Fix broken markdown-like table formatting ---
  let processedHtml = html;
  
  // More general approach: Find ALL markdown-like table patterns in the content
  // Look for complete table blocks and replace them entirely
  const tableBlockPattern = /(\|\s*[^|<]+.*?\|[\s\S]*?)(?=<[^b]|$)/g;
  let match;
  
  while ((match = tableBlockPattern.exec(processedHtml)) !== null) {
    const tableBlock = match[1];
    
    // Split the table block by <br> tags to get individual lines
    const lines = tableBlock.split(/<br\s*\/?>/gi);
    const tableLines = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      // Check if this line looks like a table row
      if (trimmedLine.match(/^\s*\|\s*[^|]+.*\|\s*$/)) {
        // Skip separator lines (contains only -, |, and spaces)
        if (!trimmedLine.match(/^\s*\|\s*[-\s|]*\|\s*$/)) {
          tableLines.push(trimmedLine);
        }
      }
    }
    
    // Convert to HTML table if we found at least 2 valid table lines (header + data)
    if (tableLines.length >= 2) {
      let tableHtml = '<table>';
      let isFirstRow = true;
      
      for (const tableLine of tableLines) {
        const cells = tableLine.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
        if (cells.length > 0) {
          tableHtml += '<tr>';
          for (const cell of cells) {
            if (isFirstRow) {
              tableHtml += `<th>${cell}</th>`;
            } else {
              tableHtml += `<td>${cell}</td>`;
            }
          }
          tableHtml += '</tr>';
          isFirstRow = false;
        }
      }
      tableHtml += '</table>';
      
      // Replace the entire table block with the HTML table
      processedHtml = processedHtml.replace(tableBlock, tableHtml);
      
      // Reset the regex to start searching from the beginning since we modified the string
      tableBlockPattern.lastIndex = 0;
    }
  }
  
  // Now process with cheerio
  const $ = load(processedHtml || "");

  // --- COMPREHENSIVE: Clean up all possible navigation patterns ---
  
  // Remove known navigation classes and elements
  $('.nsg-adjacent-links, .nsg-adjacent-links-wrapper').remove();
  $('.post-navigation, .nav-links, .navigation-links').remove();
  $('.prev-post, .next-post, .post-nav').remove();
  $('.pagination, .page-navigation').remove();
  
  // Remove WordPress/Elementor navigation widgets
  $('.elementor-widget-post-navigation').remove();
  $('[data-widget_type="post-navigation.default"]').remove();
  $('[data-widget_type="theme-post-navigation.default"]').remove();
  
  // Remove author box widgets
  $('.elementor-widget-author-box').remove();
  $('[data-widget_type="author-box.default"]').each(function () {
    $(this).closest('[data-element_type="widget"]').remove();
  });

  // Remove existing Viator tours content (static HTML from WordPress)
  $('.viator-tours, .tour-item').remove();
  $('[class*="viator"], [id*="viator"]').remove();
  
  // Combine selector filtering and reduce DOM traversal for headings related to "highest rated" tours
  $('h2, h3')
    .filter(function () {
      const text = $(this).text().toLowerCase();
      return text.includes('highest rated') && (text.includes('tour') || text.includes('sight-seeing'));
    })
    .each(function () {
      // Collect all elements to remove: the heading and associated tour content
      const toRemove = [this];
      $(this).nextUntil('h1, h2, h3').each(function () {
        const elemText = $(this).text().toLowerCase();
        if (
          elemText.includes('book now') ||
          elemText.includes('from:') ||
          elemText.includes('reviews') ||
          elemText.includes('duration')
        ) {
          toRemove.push(this);
        }
      });
      $(toRemove).remove();
    });

  // Remove divs that look like tour cards (contain book now, pricing, etc.)
  $('div').each(function () {
    const divText = $(this).text().toLowerCase();
    if (
      (divText.includes('book now') && divText.includes('from:')) ||
      (divText.includes('reviews') && divText.includes('hrs')) ||
      divText.includes('viator')
    ) {
      $(this).remove();
    }
  });

  // Remove script tags that contain viator tour functionality
  $('script').each(function () {
    const scriptContent = $(this).html();
    if (scriptContent && scriptContent.toLowerCase().includes('viator')) {
      $(this).remove();
    }
  });

  // Remove navigation links by text content (comprehensive patterns)
  $('a').each(function () {
    const linkText = $(this).text().toLowerCase().trim();
    const navigationPatterns = [
      'previous post',
      'next post',
      'prev post',
      'previous',
      'next',
      'overview',
      '← previous',
      'next →',
      '‹ previous',
      'next ›',
      'previous article',
      'next article',
      'previous page',
      'next page',
      'read previous',
      'read next',
      'view previous',
      'view next',
      'back to overview',
      'continue reading',
      'related posts',
      'more posts'
    ];
    
    const isNavigationLink = navigationPatterns.some(pattern =>
      linkText.includes(pattern) ||
      linkText === pattern ||
      linkText.startsWith(pattern) ||
      linkText.endsWith(pattern)
    );
    
    if (isNavigationLink) {
      // Remove the link and potentially its parent container
      const parentDiv = $(this).closest('div');
      if (parentDiv.length && parentDiv.children().length === 1) {
        parentDiv.remove();
      } else {
        $(this).remove();
      }
    }
  });

  // Remove containers that only contain navigation elements
  $('div, section, nav').each(function () {
    const containerText = $(this).text().toLowerCase().trim();
    const isNavigationContainer =
      containerText.match(/^(previous|next|prev|overview|navigation|more posts|related posts)/i) ||
      containerText.match(/(previous|next)\s*(post|page|article)$/i);
    
    if (isNavigationContainer && containerText.length < 100) {
      $(this).remove();
    }
  });

  // Remove divs that only contain links or navigation elements
  $('div').each(function () {
    const children = $(this).children();
    if (children.length > 0) {
      const onlyNavElements = children.toArray().every((el) => {
        return (
          el.tagName === "a" ||
          el.tagName === "br" ||
          el.tagName === "span" ||
          (el.tagName === "div" && $(el).text().trim().length < 50)
        );
      });
      
      if (onlyNavElements) {
        const containerText = $(this).text().toLowerCase().trim();
        if (
          containerText.includes('previous') ||
          containerText.includes('next') ||
          containerText.includes('overview') ||
          containerText.length < 50
        ) {
          $(this).remove();
        }
      }
    }
  });

  // Final cleanup: Remove any remaining empty containers
  $('div, section, nav').each(function () {
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

function ContentWithViatorTours({ htmlContent, viatorTours, city }) {
  // Split content at the injection point
  const parts = htmlContent.split('<div id="viator-tours-injection-point"></div>');
  
  return (
    <>
      {parts[0] && (
        <div dangerouslySetInnerHTML={{ __html: parts[0] }} />
      )}
      <ViatorTours city={city} tours={viatorTours} />
      {parts[1] && (
        <div dangerouslySetInnerHTML={{ __html: parts[1] }} />
      )}
    </>
  );
}

function injectViatorToursAfterParagraph(htmlContent, viatorToursComponent, paragraphIndex = 2) {
  if (!viatorToursComponent || !htmlContent) return htmlContent;

  const $ = load(htmlContent);
  const paragraphs = $('p');
  
  if (paragraphs.length >= paragraphIndex) {
    const targetParagraph = paragraphs.eq(paragraphIndex - 1);
    // Create a marker for the Viator tours injection point
    targetParagraph.after('<div id="viator-tours-injection-point"></div>');
  }
  
  return $.html();
}

export default function SeoGenPost({ post, viatorTours = [] }) {
  console.log("********* SeoGenPost RENDERED *********");
  console.log("POST OBJECT:", post);
  console.log("POST TYPE:", post && post.postType);
  console.log("POST CITY:", post && post.city);
  console.log("VIATOR TOURS LENGTH:", viatorTours.length);
  console.log("VIATOR TOURS:", viatorTours);

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
    
    // If viatorTours are provided, inject tours after 2nd paragraph
    if (viatorTours.length > 0) {
      cleanedHtml = injectViatorToursAfterParagraph(cleanedHtml, true, 2);
    }
    
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
        >
          {viatorTours.length > 0 ? (
            <ContentWithViatorTours 
              htmlContent={cleanedHtml} 
              viatorTours={viatorTours} 
              city={post?.city} 
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: cleanedHtml,
              }}
            />
          )}
        </div>
      )}
      {selectedBanner && (
        <div className="flex justify-center my-12">
          {selectedBanner}
        </div>
      )}
    </article>
  );
}