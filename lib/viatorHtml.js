import { load } from "cheerio";

/**
 * Robust HTML normalization for Viator posts to fix entity-encoded content,
 * structural issues, lazy images, and external links.
 * 
 * @param {string} htmlContent - Raw HTML content that may have formatting issues
 * @returns {string} - Normalized HTML content
 */
export function fixViatorHtml(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return htmlContent || '';
  }

  // Early exit if content appears to already be well-formed
  // Check for common signs of malformed content
  const hasEntityEncoding = htmlContent.includes('&lt;') || htmlContent.includes('&gt;') || htmlContent.includes('&amp;lt;');
  const hasEmptyParagraphs = htmlContent.includes('<p><br></p>') || htmlContent.includes('<p><br/></p>');
  const hasLazyImages = htmlContent.includes('data-src=') && htmlContent.includes('data:image/svg+xml');
  const hasUntargetedExternalLinks = htmlContent.includes('target="_blank"') && !htmlContent.includes('rel="noopener');

  // If none of these issues are present, return content as-is (idempotent)
  if (!hasEntityEncoding && !hasEmptyParagraphs && !hasLazyImages && !hasUntargetedExternalLinks) {
    return htmlContent;
  }

  let processedHtml = htmlContent;

  // Step 1: Decode entity-encoded HTML (handle nested encoding like &amp;lt;)
  if (hasEntityEncoding) {
    processedHtml = decodeHtmlEntities(processedHtml);
  }

  // Step 2: Use Cheerio for structural and content fixes
  const $ = load(processedHtml);

  // Step 3: Fix structural issues
  fixStructuralIssues($);

  // Step 4: Fix lazy images
  fixLazyImages($);

  // Step 5: Normalize external links
  normalizeExternalLinks($);

  return $.html();
}

/**
 * Safely decode HTML entities, handling nested encodings
 */
function decodeHtmlEntities(html) {
  let decoded = html;
  
  // First pass: decode common double-encoded entities
  decoded = decoded.replace(/&amp;lt;/g, '&lt;');
  decoded = decoded.replace(/&amp;gt;/g, '&gt;');
  decoded = decoded.replace(/&amp;quot;/g, '&quot;');
  decoded = decoded.replace(/&amp;amp;/g, '&amp;');

  // Second pass: decode remaining entities
  decoded = decoded.replace(/&lt;/g, '<');
  decoded = decoded.replace(/&gt;/g, '>');
  decoded = decoded.replace(/&quot;/g, '"');
  decoded = decoded.replace(/&amp;/g, '&');

  return decoded;
}

/**
 * Fix structural issues like misplaced block elements and empty paragraphs
 */
function fixStructuralIssues($) {
  // Remove empty paragraphs with just <br> tags
  $('p').each(function() {
    const $p = $(this);
    const content = $p.html();
    
    // Remove paragraphs that only contain <br> tags or are empty
    if (!content || content.trim() === '' || 
        content.trim() === '<br>' || 
        content.trim() === '<br/>' || 
        content.trim() === '<br />') {
      $p.remove();
    }
  });

  // Convert multiple consecutive <br> tags into proper paragraphs
  $('br').each(function() {
    const $br = $(this);
    let consecutiveBrs = 1;
    let nextElement = $br.next();
    
    // Count consecutive <br> tags
    while (nextElement.length && nextElement.is('br')) {
      consecutiveBrs++;
      nextElement = nextElement.next();
    }
    
    // If we have 2 or more consecutive <br> tags, replace with paragraph break
    if (consecutiveBrs >= 2) {
      // Remove the extra <br> tags
      let current = $br.next();
      while (current.length && current.is('br') && consecutiveBrs > 1) {
        const next = current.next();
        current.remove();
        current = next;
        consecutiveBrs--;
      }
      
      // Replace the first <br> with a paragraph break if appropriate
      const prevText = $br.prev().text();
      const nextText = $br.next().text();
      if (prevText && nextText) {
        $br.replaceWith('</p><p>');
      } else {
        $br.remove();
      }
    }
  });

  // Unwrap block elements that are mistakenly wrapped by <p> tags
  $('p').each(function() {
    const $p = $(this);
    const children = $p.children();
    
    // If paragraph only contains block-level elements, unwrap them
    const hasOnlyBlockElements = children.length > 0 && 
      children.toArray().every(child => {
        const tagName = child.tagName ? child.tagName.toLowerCase() : '';
        return ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'blockquote'].includes(tagName);
      });
    
    if (hasOnlyBlockElements) {
      $p.replaceWith($p.html());
    }
  });
}

/**
 * Fix lazy-loaded images by promoting data-src to src and cleaning up
 */
function fixLazyImages($) {
  $('img').each(function() {
    const $img = $(this);
    const dataSrc = $img.attr('data-src');
    const src = $img.attr('src');
    
    // Move data-src to src if src is a placeholder or empty
    if (dataSrc && (!src || src.includes('data:image/svg+xml') || src === '')) {
      $img.attr('src', dataSrc);
      $img.removeAttr('data-src');
    }
    
    // Remove common lazy loading attributes that are no longer needed
    $img.removeAttr('data-lazy');
    $img.removeAttr('data-srcset');
    $img.removeAttr('data-sizes');
    
    // Remove loading placeholder scripts
    const onload = $img.attr('onload');
    if (onload && onload.includes('data-two_delay_')) {
      $img.removeAttr('onload');
    }
  });

  // Remove duplicate noscript blocks that contain the same images
  const processedImages = new Set();
  $('noscript').each(function() {
    const $noscript = $(this);
    const content = $noscript.html();
    
    // Check if this noscript contains an image we've already processed
    if (content && content.includes('<img')) {
      const $tempDiv = $('<div>').html(content);
      const imgSrc = $tempDiv.find('img').attr('src');
      
      if (imgSrc) {
        if (processedImages.has(imgSrc)) {
          // This is a duplicate, remove it
          $noscript.remove();
        } else {
          // Check if we have a regular img tag with the same src
          const $existingImg = $(`img[src="${imgSrc}"]`);
          if ($existingImg.length > 0) {
            // We have a regular img tag, remove the noscript version
            $noscript.remove();
          } else {
            processedImages.add(imgSrc);
          }
        }
      }
    }
  });
}

/**
 * Normalize external links to include proper rel attributes
 */
function normalizeExternalLinks($) {
  $('a[target="_blank"]').each(function() {
    const $link = $(this);
    const href = $link.attr('href');
    
    if (href) {
      // Trim whitespace from href
      const trimmedHref = href.trim();
      $link.attr('href', trimmedHref);
      
      // Check if this is an external link (not relative or same domain)
      const isExternal = trimmedHref.startsWith('http://') || 
                        trimmedHref.startsWith('https://') || 
                        trimmedHref.startsWith('//');
      
      if (isExternal) {
        // Get existing rel attribute or create new one
        let rel = $link.attr('rel') || '';
        const relParts = new Set(rel.split(/\s+/).filter(Boolean));
        
        // Add security and SEO attributes for external links
        relParts.add('noopener');
        relParts.add('noreferrer');
        relParts.add('nofollow');
        
        // Set the normalized rel attribute
        $link.attr('rel', Array.from(relParts).join(' '));
      }
    }
  });
}