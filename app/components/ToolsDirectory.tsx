'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';

const fallbackEmojis: Record<string, string> = {
  "Property Management": "🏢",
  "Dynamic Pricing": "💰",
  "Guest Communication": "💬",
  "Guest Experience": "📱",
  default: "🛠️"
};

// TypeScript interface for a Tool
interface Tool {
  _id?: string;
  Name?: string;
  Domain?: string;
  Website?: string;
  AffiliateLink?: string;
  Category?: string;
  Badge?: string;
  Highlight?: string;
  Description?: string;
  Rating?: number | string;
  UserCount?: number | string;
  Pricing?: string;
  Pros?: string[] | string;
  Cons?: string[] | string;
  Features?: string[] | string;
  DontShow?: boolean;
  Featured?: boolean;
  [key: string]: unknown;
}

// Cache configuration
const CACHE_KEY = 'tools_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheData {
  data: Tool[];
  timestamp: number;
}

function generateStars(rating?: number) {
  if (!rating || isNaN(rating)) return null;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  return (
    <>
      {Array.from({ length: fullStars }, (_, i) => (
        <span key={i} className="text-yellow-400">★</span>
      ))}
      {hasHalfStar && <span className="text-yellow-400">☆</span>}
    </>
  );
}

function getLogoUrl(domain?: string, category?: string) {
  if (domain && domain !== "N/A") {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://logo.clearbit.com/${cleanDomain}`;
  }
  return fallbackEmojis[category || "default"];
}

function getButtonLink(tool: Tool) {
  const link = tool.AffiliateLink?.toString().trim() || tool.Website?.toString().trim() || tool.Domain?.toString().trim() || "";
  if (!link) return "";
  if (/^https?:\/\//i.test(link)) {
    return link;
  }
  return `https://${link}`;
}

function cleanText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "number" && isNaN(value)) return "";
  if (typeof value === "string" && (value === "NaN" || value === "N/A")) return "";
  return value as string;
}

function formatUserCount(userCount: unknown): string {
  const cleaned = cleanText(userCount);
  return cleaned && cleaned !== "N/A" ? `(${cleaned})` : "";
}

type ToolsDirectoryProps = {
  featuredOnly?: boolean;
};

function getUniqueCategoriesFromTools(tools: Tool[]): string[] {
  const cats = new Set<string>();
  tools.forEach(tool => {
    if (tool.Category && typeof tool.Category === 'string') {
      cats.add(tool.Category.trim());
    }
  });
  return Array.from(cats);
}

// Cache utilities
function getCachedData(): Tool[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const cacheData: CacheData = JSON.parse(cached);
    const now = Date.now();
    
    if (now - cacheData.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return cacheData.data;
  } catch {
    return null;
  }
}

function setCachedData(data: Tool[]): void {
  if (typeof window === 'undefined') return;
  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch {
    // Ignore cache errors
  }
}

// Logo component with error handling and loading states using Next.js Image
function ToolLogo({ domain, category, name }: { domain?: string; category?: string; name?: string }) {
  const [logoError, setLogoError] = useState(false);
  
  const logoUrl = getLogoUrl(domain, category);
  const isImageLogo = typeof logoUrl === "string" && logoUrl.startsWith("http");
  
  if (!isImageLogo) {
    return <span className="text-3xl">{logoUrl}</span>;
  }
  
  if (logoError) {
    return <span className="text-3xl">{fallbackEmojis[category || "default"]}</span>;
  }
  
  return (
    <div className="relative h-8 w-8 bg-gray-100 rounded overflow-hidden" style={{ minWidth: 32 }}>
      <Image
        src={logoUrl}
        alt={name || 'Tool logo'}
        width={32}
        height={32}
        className="object-contain"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo="
        onError={() => setLogoError(true)}
        loading="lazy"
        sizes="32px"
        unoptimized={false}
      />
    </div>
  );
}

// Memoized tool card component to prevent unnecessary re-renders
const ToolCard = React.memo(({ tool }: { tool: Tool }) => {
  // Pre-process data to avoid computing on every render
  const toolData = useMemo(() => {
    const features = Array.isArray(tool.Features)
      ? tool.Features
      : (typeof tool.Features === "string"
        ? tool.Features.split('|').map((f: string) => f.trim()).filter(Boolean)
        : []);

    const pros = Array.isArray(tool.Pros)
      ? tool.Pros
      : (typeof tool.Pros === "string"
        ? tool.Pros.split('|').map((p: string) => p.trim()).filter(Boolean)
        : []);

    let rating = typeof tool.Rating === "number"
      ? tool.Rating
      : parseFloat((tool.Rating || '').toString().replace(/[^\d.]/g, ''));

    if (!isFinite(rating)) rating = 0;
    
    const buttonLink = getButtonLink(tool);
    const showButton = !!buttonLink;
    const priceDisplay = cleanText(tool.Pricing) || "—";
    
    return {
      features,
      pros,
      rating,
      buttonLink,
      showButton,
      priceDisplay
    };
  }, [tool]);

  return (
    <div
      className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col p-8 hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 min-h-[440px]"
    >
      {/* Logo and tag row: flex, spaced */}
      <div className="flex items-center justify-between mb-3 min-h-[2.5rem]">
        {/* Logo left */}
        <ToolLogo domain={tool.Domain} category={tool.Category} name={tool.Name} />
        {/* Tag right */}
        {tool.Badge && (
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full ml-2 whitespace-nowrap">
            {cleanText(tool.Badge)}
          </span>
        )}
      </div>
      {/* Name/title */}
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{cleanText(tool.Name)}</h3>
      {/* Highlight/subheadline */}
      {cleanText(tool.Highlight) && (
        <div className="text-base text-indigo-700 font-medium mb-2">{cleanText(tool.Highlight)}</div>
      )}
      {/* Description */}
      <p className="text-base text-gray-600 mb-2">{cleanText(tool.Description)}</p>
      {/* Stars & User Count */}
      <div className="flex items-center gap-2 mb-2">
        {generateStars(toolData.rating)}
        {toolData.rating > 0 && <span className="text-gray-900 font-medium text-base">{toolData.rating}</span>}
        <span className="ml-2 text-gray-400 text-base">{formatUserCount(tool.UserCount)}</span>
      </div>
      {/* Pros */}
      {toolData.pros && toolData.pros.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {toolData.pros.map((pro: string) => (
            <span key={pro} className="inline-block bg-gray-100 text-gray-700 text-base rounded-full px-2 py-0.5">✅ {pro}</span>
          ))}
        </div>
      )}
      {/* Features */}
      {toolData.features && toolData.features.length > 0 && (
        <ul className="list-disc list-inside mb-2 text-gray-600 text-base space-y-0.5">
          {toolData.features.map((feature: string) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}
      {/* Price & Button row */}
      <div className="mt-auto flex flex-row justify-between items-center border-t border-gray-100 pt-2 gap-2">
        <span
          className="text-base text-gray-500 font-normal truncate max-w-[60%]"
          title={toolData.priceDisplay}
        >
          {toolData.priceDisplay.startsWith('From') ? (
            <>From <span className="text-indigo-700 font-bold">{toolData.priceDisplay.replace('From ', '')}</span></>
          ) : (
            <span className="text-indigo-700 font-bold">{toolData.priceDisplay}</span>
          )}
        </span>
        <a
          href={toolData.showButton ? toolData.buttonLink : undefined}
          target="_blank"
          rel="noopener"
          className={`px-5 py-2 rounded-full text-white font-semibold text-base shadow transition text-center whitespace-nowrap ${toolData.showButton ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed pointer-events-none"}`}
          aria-disabled={!toolData.showButton}
          tabIndex={toolData.showButton ? 0 : -1}
        >
          Try Now →
        </a>
      </div>
    </div>
  );
});

ToolCard.displayName = 'ToolCard';

export default function ToolsDirectory({ featuredOnly = false }: ToolsDirectoryProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = useCallback(async (retryCount = 0) => {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setTools(cachedData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Add timeout for client-side requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const res = await fetch('/api/tools', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch tools: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      const transformedTools = data.map((rec: { fields: Tool; id: string }) => ({
        ...rec.fields,
        _id: rec.id
      }));
      
      setTools(transformedTools);
      setCachedData(transformedTools);
    } catch (err) {
      console.error('Error fetching tools:', err);
      
      // Retry logic for network errors (max 2 retries)
      if (retryCount < 2 && (
        err instanceof Error && (
          err.name === 'AbortError' || 
          err.message.includes('fetch') ||
          err.message.includes('network')
        )
      )) {
        console.log(`Retrying fetch tools (attempt ${retryCount + 1})`);
        setTimeout(() => fetchTools(retryCount + 1), 1000 * (retryCount + 1)); // Progressive delay
        return;
      }
      
      setError('Failed to load tools. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  // Filter: Don'tShow, Featured - memoized with dependency array
  const displayTools = useMemo(() => {
    let result = tools.filter((tool) => !tool.DontShow);
    if (featuredOnly) {
      result = result.filter((tool) => !!tool.Featured);
    }
    return result;
  }, [tools, featuredOnly]);

  // Dynamic categories: built from currently displayed tools (not filtered by category yet!)
  const dynamicCategories = useMemo(() => {
    const cats = getUniqueCategoriesFromTools(displayTools);
    return [
      { label: "All Tools", value: "all" },
      ...cats.map((c: string) => ({ label: c, value: c }))
    ];
  }, [displayTools]);

  // Filter tools for grid (category) - memoized with specific dependencies
  const filteredTools = useMemo(() => {
    if (activeCategory === "all") return displayTools;
    return displayTools.filter((tool) => tool.Category === activeCategory);
  }, [activeCategory, displayTools]);

  // Error state
  if (error) {
    return (
      <section id="tools" className="bg-gray-50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => fetchTools()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tools" className="bg-gray-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
            {featuredOnly
              ? "Featured Tools for Airbnb Hosts"
              : "Essential Airbnb Management Tools"}
          </h2>
          <p className="text-lg text-gray-500 mb-7">
            {featuredOnly
              ? "Handpicked solutions to streamline operations, boost bookings, and give you back your time—trusted by leading hosts worldwide."
              : "Discover the best software solutions to automate and optimize your hosting business"}
          </p>
        </div>
        {/* Dynamic Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-14">
          {dynamicCategories.map((cat) => (
            <button
              key={String(cat.value)}
              className={`px-6 py-2 rounded-full border text-sm font-semibold transition
                ${
                  activeCategory === cat.value
                    ? "bg-indigo-600 text-white border-indigo-600 shadow ring-2 ring-indigo-300"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200"
                }
              `}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* Loading state with skeleton */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 min-h-[440px]">
                <div className="animate-pulse">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                  <div className="h-16 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="flex gap-2 mb-2">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No tools found for the selected category.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool: Tool) => (
              <ToolCard key={tool._id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}