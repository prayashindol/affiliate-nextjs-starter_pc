'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import FavoriteButton from './FavoriteButton';
import { toolSlug } from './util/toolSlug';

const fallbackEmojis: Record<string, string> = {
  "Property Management": "🏢",
  "Dynamic Pricing": "💰",
  "Guest Communication": "💬",
  "Guest Experience": "📱",
  default: "🛠️"
};

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
  CleanedName?: string;
  [key: string]: unknown;
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

function cleanText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "number" && isNaN(value)) return "";
  if (typeof value === "string" && (value === "NaN" || value === "N/A")) return "";
  return value as string;
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

function ToolsDirectoryComponent({ featuredOnly = false }: ToolsDirectoryProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isTestData, setIsTestData] = useState(false);

  const processToolsData = useCallback((rawTools: Tool[]) => {
    return rawTools.map(tool => {
      const features = Array.isArray(tool.Features)
        ? tool.Features
        : (typeof tool.Features === "string"
          ? tool.Features.split('|').map(f => f.trim()).filter(Boolean)
          : []);
      
      const pros = Array.isArray(tool.Pros)
        ? tool.Pros
        : (typeof tool.Pros === "string"
          ? tool.Pros.split('|').map(p => p.trim()).filter(Boolean)
          : []);
      
      let rating = typeof tool.Rating === "number"
        ? tool.Rating
        : parseFloat((tool.Rating || '').toString().replace(/[^\d.]/g, ''));
      if (!isFinite(rating)) rating = 0;

      return {
        ...tool,
        _normalized: {
          features,
          pros,
          rating
        }
      };
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        let recs: { fields: Tool; id: string }[] = []
        if (Array.isArray(data)) recs = data
        else if (Array.isArray(data.records)) recs = data.records
        else if (Array.isArray(data.data)) recs = data.data
        const shaped = recs.map(r => ({ ...r.fields, _id: r.id }))
        if (shaped.some(t => t?._id?.startsWith?.('test') || t?.Name === 'PriceLabs')) {
          setIsTestData(true)
        }
        setTools(shaped)
      })
      .catch(err => {
        if (isMounted) setApiError(err?.message || 'Unknown error')
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const displayTools = useMemo(() => {
    let result = tools.filter(tool => !tool.DontShow)
    if (featuredOnly) result = result.filter(t => !!t.Featured)
    return processToolsData(result)
  }, [tools, featuredOnly, processToolsData])

  const dynamicCategories = useMemo(() => {
    const cats = getUniqueCategoriesFromTools(displayTools);
    return [
      { label: "All Tools", value: "all" },
      ...cats.map(c => ({ label: c, value: c }))
    ];
  }, [displayTools]);

  const filteredTools = useMemo(
    () => activeCategory === 'all'
      ? displayTools
      : displayTools.filter(t => t.Category === activeCategory),
    [activeCategory, displayTools]
  );

  return (
    <section id="tools" className="bg-gray-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
            {featuredOnly ? "Featured Tools for Airbnb Hosts" : "Essential Airbnb Management Tools"}
          </h2>
          <p className="text-lg text-gray-500 mb-7">
            {featuredOnly
              ? "Handpicked solutions to streamline operations, boost bookings, and give you back your time."
              : "Discover the best software solutions to automate and optimize your hosting business"}
          </p>
          {apiError && (
            <div className="text-sm text-red-600">
              Failed loading tools: {apiError}
            </div>
          )}
          {isTestData && !apiError && (
            <div className="text-xs text-gray-400">
              Using fallback test dataset (Airtable env vars not set).
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-14">
          {dynamicCategories.map(cat => (
            <button
              key={String(cat.value)}
              className={`px-6 py-2 rounded-full border text-sm font-semibold transition
                ${
                  activeCategory === cat.value
                    ? "bg-indigo-600 text-white border-indigo-600 shadow ring-2 ring-indigo-300"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200"
                }`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading tools…</div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg mb-4">
              {featuredOnly ? "No featured tools available" : "No tools available"}
            </div>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map(tool => {
              const normalized = tool._normalized || {}
              const ratingStars = generateStars(normalized.rating)
              const emoji = fallbackEmojis[tool.Category || ''] || fallbackEmojis.default
              // External link preference
              const externalUrl = tool.AffiliateLink || tool.Website || tool.Domain
              // Potential future internal slug (not used if no slug)
              const internal = toolSlug(tool)
              return (
                <div
                  key={tool._id}
                  className="relative flex flex-col bg-white rounded-2xl shadow border border-gray-100 overflow-hidden"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl" aria-hidden="true">{emoji}</span>
                      <FavoriteButton 
                        item={{
                          id: String(tool._id),
                          title: tool.Name || 'Unknown Tool',
                          type: 'tool' as const,
                          url: externalUrl || `/tools/${internal}` || '#'
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold leading-snug mb-2">
                      {tool.Name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {cleanText(tool.Description)}
                    </p>
                    <div className="mt-auto">
                      {ratingStars && (
                        <div className="mb-2 text-xs text-yellow-500 flex items-center gap-1">
                          {ratingStars} <span className="text-gray-400">{normalized.rating.toFixed(1)}</span>
                        </div>
                      )}
                      {tool.Category && (
                        <div className="text-[11px] uppercase tracking-wide font-medium text-indigo-600 mb-3">
                          {tool.Category}
                        </div>
                      )}
                      {externalUrl ? (
                        <a
                          href={externalUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-full transition"
                        >
                          Visit
                        </a>
                      ) : internal ? (
                        <a
                          href={`/tools/${internal}`}
                          className="inline-block text-center w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-2 px-4 rounded-full transition"
                        >
                          Details
                        </a>
                      ) : (
                        <span className="inline-block w-full text-center text-xs text-gray-400 py-2">
                          No link available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(ToolsDirectoryComponent);