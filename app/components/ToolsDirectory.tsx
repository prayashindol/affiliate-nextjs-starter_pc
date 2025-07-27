'use client';

import { useState, useEffect, useMemo } from 'react';

const fallbackEmojis: Record<string, string> = {
  "Property Management": "🏢",
  "Dynamic Pricing": "💰",
  "Guest Communication": "💬",
  "Guest Experience": "📱",
  default: "🛠️"
};

const categories = [
  { label: "All Tools", value: "all" },
  { label: "Property Management", value: "Property Management" },
  { label: "Dynamic Pricing", value: "Dynamic Pricing" },
  { label: "Guest Communication", value: "Guest Communication" },
  { label: "Guest Experience", value: "Guest Experience" }
];

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

function getButtonLink(tool: any) {
  return tool.AffiliateLink?.trim() || tool.Website?.trim() || tool.Domain?.trim() || "";
}

function cleanText(value: any) {
  if (!value) return "";
  if (typeof value === "number" && isNaN(value)) return "";
  if (typeof value === "string" && (value === "NaN" || value === "N/A")) return "";
  return value;
}

function formatUserCount(userCount: any) {
  const cleaned = cleanText(userCount);
  return cleaned && cleaned !== "N/A" ? `(${cleaned})` : "";
}

export default function ToolsDirectory() {
  const [tools, setTools] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        setTools(
          data.map((rec: any) => ({
            ...rec.fields,
            _id: rec.id
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTools = useMemo(() => {
    if (activeCategory === "all") return tools;
    return tools.filter((tool) => tool.Category === activeCategory);
  }, [activeCategory, tools]);

  return (
    <section id="tools" className="bg-gray-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">Essential Airbnb Management Tools</h2>
          <p className="text-lg text-gray-500 mb-7">
            Discover the best software solutions to automate and optimize your hosting business
          </p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-14">
          {categories.map((cat) => (
            <button
              key={cat.value}
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
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => {
              const logo = getLogoUrl(tool.Domain, tool.Category);

              const features = Array.isArray(tool.Features)
                ? tool.Features
                : (tool.Features?.split?.('|') || []).map((f: string) => f.trim()).filter(Boolean);

              const pros = Array.isArray(tool.Pros)
                ? tool.Pros
                : (tool.Pros?.split?.('|') || []).map((p: string) => p.trim()).filter(Boolean);

              let rating = typeof tool.Rating === "number"
                ? tool.Rating
                : parseFloat((tool.Rating || '').toString().replace(/[^\d.]/g, ''));

              if (!isFinite(rating)) rating = undefined;

              const buttonLink = getButtonLink(tool);
              const showButton = !!buttonLink;

              // Price line: max 1 line, ellipsis if too long
              const priceDisplay = cleanText(tool.Pricing) || "—";

              return (
                <div
                  key={tool._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col p-6 hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 min-h-[440px]"
                >
                  {/* Badge + Logo */}
                  <div className="flex items-center mb-2 min-h-[2.25rem]">
                    {tool.Badge && (
                      <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-lg mr-2">
                        {cleanText(tool.Badge)}
                      </span>
                    )}
                    {/* Logo left-aligned, never pushed right */}
                    {typeof logo === "string" && logo.startsWith("http") ? (
                      <img
                        src={logo}
                        alt={tool.Name}
                        className="h-8 w-8 object-contain rounded bg-gray-100 mr-2"
                        onError={e => (e.currentTarget.style.display = "none")}
                        style={{ minWidth: 32 }}
                      />
                    ) : (
                      <span className="text-3xl mr-2">{logo}</span>
                    )}
                  </div>
                  {/* Name */}
                  <div className="mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{cleanText(tool.Name)}</h3>
                  </div>
                  {/* Highlight/Summary */}
                  {cleanText(tool.Highlight) && (
                    <div className="text-xs text-emerald-600 font-semibold mb-2">{cleanText(tool.Highlight)}</div>
                  )}
                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-2">{cleanText(tool.Description)}</p>
                  {/* Stars & User Count */}
                  <div className="flex items-center gap-2 mb-2">
                    {generateStars(rating)}
                    {rating && <span className="text-gray-900 font-medium text-sm">{rating}</span>}
                    <span className="ml-2 text-gray-400 text-xs">{formatUserCount(tool.UserCount)}</span>
                  </div>
                 {/* Pros (green ticks, vertical list) */}
{pros && pros.length > 0 && (
  <ul className="mb-2 space-y-1">
    {pros.map((pro: string) => (
      <li key={pro} className="flex items-start gap-2 text-sm text-gray-700">
        <span className="inline-block mt-0.5 text-green-500">✔️</span>
        <span>{pro}</span>
      </li>
    ))}
  </ul>
)}

{/* Features (regular bullets, vertical list) */}
{features && features.length > 0 && (
  <ul className="mb-2 space-y-1 list-disc list-inside text-xs text-gray-600">
    {features.map((feature: string) => (
      <li key={feature} className="ml-1">{feature}</li>
    ))}
  </ul>
)}
                  {/* Price & Button row */}
                  <div className="mt-auto flex flex-row justify-between items-center border-t border-gray-100 pt-2 gap-2">
                    <span
                      className="text-sm text-gray-500 font-normal truncate max-w-[60%]"
                      title={priceDisplay}
                    >
                      {priceDisplay.startsWith('From') ? (
                        <>From <span className="text-indigo-700 font-bold">{priceDisplay.replace('From ', '')}</span></>
                      ) : (
                        <span className="text-indigo-700 font-bold">{priceDisplay}</span>
                      )}
                    </span>
                    <a
                      href={showButton ? buttonLink : undefined}
                      target="_blank"
                      rel="noopener"
                      className={`px-4 py-2 rounded-full text-white font-semibold text-sm transition shadow text-center whitespace-nowrap ${showButton ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed pointer-events-none"}`}
                      aria-disabled={!showButton}
                      tabIndex={showButton ? 0 : -1}
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
