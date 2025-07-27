'use client';

import { useState, useMemo } from 'react';

// Utility to split a string into a list (handles arrays, semicolons, commas, pipes)
const splitToList = (val?: string | string[]) =>
  Array.isArray(val)
    ? val
    : typeof val === "string"
      ? val.split(/[;|,]/).map((s) => s.trim()).filter(Boolean)
      : [];

// Get the Clearbit logo URL for a given domain (or fallback emoji)
const getLogoUrl = (domain?: string) =>
  domain
    ? `https://logo.clearbit.com/${domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}?size=64`
    : null;

// Star generator
function generateStars(rating?: number) {
  if (!rating) return null;
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

const categories = [
  { label: "All Tools", value: "all" },
  { label: "Property Management", value: "Property Management" },
  { label: "Dynamic Pricing", value: "Dynamic Pricing" },
  { label: "Guest Communication", value: "Guest Communication" },
  { label: "Guest Experience", value: "Guest Experience" }
];

export default function ToolsDirectory({ records = [] }: { records: any[] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  // Map Airtable records to normalized tool objects
  const tools = useMemo(() =>
    records.map((rec: any) => {
      const f = rec.fields || {};
      return {
        id: rec.id,
        name: f.Name,
        category: f.Category,
        description: f.Description,
        rating: f.Rating ? parseFloat(f.Rating) : undefined,
        pricing: f.Pricing || "",
        features: f.Features,
        pros: f.Pros,
        affiliateLink: f.AffiliateLink || "",
        domain: f.Domain || "",
        badge: f.Badge,
        highlight: f.Highlight,
        summary: f.Summary,
        userCount: f.UserCount,
        integrations: splitToList(f.Integrations),
      };
    })
  , [records]);

  // Filtered by category
  const filteredTools = useMemo(
    () =>
      activeCategory === "all"
        ? tools
        : tools.filter((tool) => tool.category === activeCategory),
    [tools, activeCategory]
  );

  return (
    <section id="tools" className="bg-gray-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
            Essential Airbnb Management Tools
          </h2>
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const prosList = splitToList(tool.pros);
            const featuresList = splitToList(tool.features);
            const logoUrl = getLogoUrl(tool.domain);
            const summaryLine = tool.highlight || tool.summary;
            const buttonUrl = tool.affiliateLink || (tool.domain && `https://${tool.domain}`);
            const buttonDisabled = !buttonUrl;

            return (
              <div
                key={tool.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col p-6 hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 min-h-[460px]"
              >
                {/* Badge and Logo Row */}
                <div className="flex justify-between items-start mb-2">
                  {tool.badge && (
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-lg">{tool.badge}</span>
                  )}
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden ml-auto">
                    {logoUrl ? (
                      // Show logo if exists, fallback to emoji otherwise
                      <img src={logoUrl} alt={`${tool.name} logo`} className="object-contain w-8 h-8" onError={(e) => { (e.target as HTMLImageElement).src = "/favicon.ico" }} />
                    ) : (
                      <span className="text-2xl">🔧</span>
                    )}
                  </span>
                </div>
                {/* Name and Category */}
                <h3 className="text-lg font-bold text-gray-900">{tool.name}</h3>
                {summaryLine && (
                  <div className="text-emerald-700 font-semibold text-sm mb-1">{summaryLine}</div>
                )}
                {/* Description */}
                {tool.description && <p className="text-gray-700 text-sm mb-2">{tool.description}</p>}
                {/* Stars & Reviews */}
                {tool.rating && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{generateStars(tool.rating)}</span>
                    <span className="text-gray-900 font-medium text-sm">{tool.rating}</span>
                    {tool.userCount && (
                      <span className="ml-2 text-gray-400 text-xs">({tool.userCount})</span>
                    )}
                  </div>
                )}
                {/* Pros - as green tick bullets */}
                {prosList.length > 0 && (
                  <ul className="mb-2 space-y-1">
                    {prosList.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="inline-block mt-0.5 text-green-500">✔️</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Features - as simple bullet points */}
                {featuresList.length > 0 && (
                  <ul className="mb-2 space-y-1 list-disc list-inside text-xs text-gray-600">
                    {featuresList.map((feature) => (
                      <li key={feature} className="ml-1">{feature}</li>
                    ))}
                  </ul>
                )}
                {/* Price and Button Row */}
                <div className="mt-auto">
                  <div className="border-t border-gray-100 pt-2 flex flex-row justify-between items-center gap-2">
                    <span className="text-sm text-indigo-700 font-bold truncate max-w-[60%]">
                      {tool.pricing || ""}
                    </span>
                    <a
                      href={buttonUrl || "#"}
                      target={buttonUrl ? "_blank" : undefined}
                      rel="noopener"
                      className={`px-6 py-2 rounded-full font-semibold text-white transition shadow
                        ${buttonUrl
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-gray-300 cursor-not-allowed"}
                      `}
                      tabIndex={buttonUrl ? 0 : -1}
                      aria-disabled={!buttonUrl}
                    >
                      Try Now →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
