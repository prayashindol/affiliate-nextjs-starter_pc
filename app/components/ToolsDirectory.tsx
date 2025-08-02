'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';

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

  // Pre-process all tools data in a single pass to reduce render-time calculations
  const processToolsData = useCallback((rawTools: Tool[]) => {
    return rawTools.map(tool => {
      // Pre-calculate all expensive operations
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
      
      const buttonLink = tool.AffiliateLink?.toString().trim() || tool.Website?.toString().trim() || tool.Domain?.toString().trim() || "";
      const processedButtonLink = !buttonLink ? "" : (/^https?:\/\//i.test(buttonLink) ? buttonLink : `https://${buttonLink}`);
      
      const cleanedName = cleanText(tool.Name);
      const cleanedDescription = cleanText(tool.Description);
      const cleanedHighlight = cleanText(tool.Highlight);
      const cleanedBadge = cleanText(tool.Badge);
      const cleanedPricing = cleanText(tool.Pricing) || "—";
      const formattedUserCount = tool.UserCount && cleanText(tool.UserCount) && cleanText(tool.UserCount) !== "N/A" ? `(${cleanText(tool.UserCount)})` : "";
      
      // Pre-calculate logo info
      const domain = tool.Domain;
      const category = tool.Category;
      let logoUrl = null;
      const fallbackEmoji = fallbackEmojis[category || "default"];
      
      if (domain && domain !== "N/A") {
        const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
        logoUrl = `https://logo.clearbit.com/${cleanDomain}`;
      }
      
      return {
        ...tool,
        // Processed data
        processedFeatures: features,
        processedPros: pros,
        processedRating: rating,
        processedButtonLink,
        showButton: !!processedButtonLink,
        cleanedName,
        cleanedDescription,
        cleanedHighlight,
        cleanedBadge,
        cleanedPricing,
        formattedUserCount,
        logoUrl,
        fallbackEmoji
      };
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setTools(
            (data as { fields: Tool; id: string }[]).map((rec) => ({
              ...rec.fields,
              _id: rec.id
            }))
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter: Don'tShow, Featured and process all data
  const displayTools = useMemo(() => {
    let result = tools.filter((tool) => !tool.DontShow);
    if (featuredOnly) {
      result = result.filter((tool) => !!tool.Featured);
    }
    return processToolsData(result);
  }, [tools, featuredOnly, processToolsData]);

  // Dynamic categories: built from currently displayed tools (not filtered by category yet!)
  const dynamicCategories = useMemo(() => {
    const cats = getUniqueCategoriesFromTools(displayTools);
    return [
      { label: "All Tools", value: "all" },
      ...cats.map((c: string) => ({ label: c, value: c }))
    ];
  }, [displayTools]);

  // Filter tools for grid (category)
  const filteredTools = useMemo(() => {
    if (activeCategory === "all") return displayTools;
    return displayTools.filter((tool) => tool.Category === activeCategory);
  }, [activeCategory, displayTools]);

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
        {/* Loading state */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading tools…</div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg mb-4">
              {featuredOnly ? "No featured tools available" : "No tools available"}
            </div>
            <p className="text-gray-500 text-sm">
              Tools data is configured to load from Airtable. Please ensure the Airtable integration is properly set up.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => { // Using typed tool
              return (
                <div
                  key={tool._id}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col p-8 hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 min-h-[440px]"
                >
                  {/* Logo and tag row: flex, spaced */}
                  <div className="flex items-center justify-between mb-3 min-h-[2.5rem]">
                    {/* Logo left */}
                    <div className="flex items-center gap-2">
                      {tool.logoUrl ? (
                        <div className="relative h-8 w-8 bg-gray-100 rounded overflow-hidden" style={{ minWidth: 32 }}>
                          <Image
                            src={tool.logoUrl}
                            alt={tool.cleanedName}
                            fill
                            sizes="32px"
                            className="object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const sibling = target.nextElementSibling as HTMLElement;
                              if (sibling) {
                                sibling.style.display = 'inline';
                              }
                            }}
                          />
                          <span className="text-3xl hidden absolute inset-0 flex items-center justify-center">{tool.fallbackEmoji}</span>
                        </div>
                      ) : (
                        <span className="text-3xl">{tool.fallbackEmoji}</span>
                      )}
                    </div>
                    {/* Favorite and Tag right */}
                    <div className="flex items-center gap-2">
                      <FavoriteButton 
                        item={{
                          id: tool._id || tool.cleanedName || '',
                          title: tool.cleanedName || '',
                          type: 'tool',
                          url: tool.Website || tool.AffiliateLink || '#'
                        }}
                        className="text-gray-400 hover:text-red-500"
                      />
                      {tool.cleanedBadge && (
                        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                          {tool.cleanedBadge}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Name/title */}
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{tool.cleanedName}</h3>
                  {/* Highlight/subheadline */}
                  {tool.cleanedHighlight && (
                    <div className="text-base text-indigo-700 font-medium mb-2">{tool.cleanedHighlight}</div>
                  )}
                  {/* Description */}
                  <p className="text-base text-gray-600 mb-2">{tool.cleanedDescription}</p>
                  {/* Stars & User Count */}
                  <div className="flex items-center gap-2 mb-2">
                    {generateStars(tool.processedRating)}
                    {tool.processedRating > 0 && <span className="text-gray-900 font-medium text-base">{tool.processedRating}</span>}
                    <span className="ml-2 text-gray-400 text-base">{tool.formattedUserCount}</span>
                  </div>
                  {/* Pros */}
                  {tool.processedPros && tool.processedPros.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tool.processedPros.map((pro: string) => (
                        <span key={pro} className="inline-block bg-gray-100 text-gray-700 text-base rounded-full px-2 py-0.5">✅ {pro}</span>
                      ))}
                    </div>
                  )}
                  {/* Features */}
                  {tool.processedFeatures && tool.processedFeatures.length > 0 && (
                    <ul className="list-disc list-inside mb-2 text-gray-600 text-base space-y-0.5">
                      {tool.processedFeatures.map((feature: string) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  )}
                  {/* Price & Button row */}
                  <div className="mt-auto flex flex-row justify-between items-center border-t border-gray-100 pt-2 gap-2">
                    <span
                      className="text-base text-gray-500 font-normal truncate max-w-[60%]"
                      title={tool.cleanedPricing}
                    >
                      {tool.cleanedPricing.startsWith('From') ? (
                        <>From <span className="text-indigo-700 font-bold">{tool.cleanedPricing.replace('From ', '')}</span></>
                      ) : (
                        <span className="text-indigo-700 font-bold">{tool.cleanedPricing}</span>
                      )}
                    </span>
                    <a
                      href={tool.showButton ? tool.processedButtonLink : undefined}
                      target="_blank"
                      rel="noopener"
                      className={`px-5 py-2 rounded-full text-white font-semibold text-base shadow transition text-center whitespace-nowrap ${tool.showButton ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed pointer-events-none"}`}
                      aria-disabled={!tool.showButton}
                      tabIndex={tool.showButton ? 0 : -1}
                    >
                      Try Now →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

const ToolsDirectory = memo(ToolsDirectoryComponent);
export default ToolsDirectory;
