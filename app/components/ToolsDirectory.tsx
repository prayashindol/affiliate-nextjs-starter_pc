'use client';

import { useState, useEffect, useMemo } from 'react';

// SVG Integration Icons (same as before)
const IntegrationIcons = ({ integrations = [] }: { integrations: string[] }) => (
  <div className="flex gap-2 mt-1">
    {integrations.includes('Airbnb') && (
      <span title="Airbnb">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#FF5A5F" d="M12 3.5c-3.15 0-5.7 2.62-5.7 5.84 0 2.07 1.17 4.02 3.5 6.93L12 19.5l2.2-3.23c2.32-2.91 3.5-4.86 3.5-6.93C17.7 6.12 15.15 3.5 12 3.5Zm0 12.61-1.6-2.35C8.26 12.09 7.5 10.94 7.5 9.34c0-2.06 1.81-3.74 4.5-3.74s4.5 1.68 4.5 3.74c0 1.6-.76 2.75-2.9 4.42L12 16.11Z"/></svg>
      </span>
    )}
    {integrations.includes('Booking') && (
      <span title="Booking.com">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" fill="#003580" rx="4"/><text x="5" y="14" fill="#fff" fontSize="8" fontFamily="Arial">B</text></svg>
      </span>
    )}
    {integrations.includes('VRBO') && (
      <span title="VRBO">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" fill="#1C5A96" rx="4"/><text x="2" y="14" fill="#fff" fontSize="8" fontFamily="Arial">VRBO</text></svg>
      </span>
    )}
  </div>
);

// Tool type based on your Airtable fields (case-sensitive!)
type Tool = {
  id: string;
  Name: string;
  Category?: string;
  Description?: string;
  Rating?: number;
  Pricing?: string;
  Features?: string[];
  AffiliateLink?: string;
  Logo?: string;
  Badge?: string;
  Highlight?: string;
  Integrations?: string[];
  UserCount?: string;
  Pros?: string[];
};

const categories = [
  { label: "All Tools", value: "all" },
  { label: "Property Management", value: "Property Management" },
  { label: "Dynamic Pricing", value: "Dynamic Pricing" },
  { label: "Guest Communication", value: "Guest Communication" },
  { label: "Guest Experience", value: "Guest Experience" }
];

function generateStars(rating: number | undefined) {
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

export default function ToolsDirectory() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        setTools(
          data.map((rec: any) => ({
            id: rec.id,
            Name: rec.fields.Name,
            Category: rec.fields.Category || "",
            Description: rec.fields.Description || "",
            Rating: rec.fields.Rating ? parseFloat(rec.fields.Rating) : undefined,
            Pricing: rec.fields.Pricing || "",
            Features: Array.isArray(rec.fields.Features) ? rec.fields.Features : [],
            AffiliateLink: rec.fields.AffiliateLink || "",
            Logo: rec.fields.Logo || "💡",
            Badge: rec.fields.Badge || "",
            Highlight: rec.fields.Highlight || "",
            Integrations: Array.isArray(rec.fields.Integrations) ? rec.fields.Integrations : [],
            UserCount: rec.fields.UserCount || "",
            Pros: Array.isArray(rec.fields.Pros) ? rec.fields.Pros : [],
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTools = useMemo(
    () =>
      activeCategory === "all"
        ? tools
        : tools.filter((tool) => tool.Category === activeCategory),
    [activeCategory, tools]
  );

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

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading tools…</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col p-6 hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 min-h-[460px]"
              >
                {/* Badge and Integrations */}
                <div className="flex justify-between items-start mb-2">
                  {tool.Badge && (
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-lg">{tool.Badge}</span>
                  )}
                  {tool.Integrations && <IntegrationIcons integrations={tool.Integrations} />}
                </div>
                {/* Logo and Name */}
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">{tool.Logo || "💡"}</span>
                  <h3 className="text-lg font-bold text-gray-900">{tool.Name}</h3>
                </div>
                {/* USP/Highlight */}
                {tool.Highlight && (
                  <div className="text-xs text-emerald-600 font-semibold mb-2">{tool.Highlight}</div>
                )}
                {/* Description */}
                <p className="text-gray-700 text-sm mb-2">{tool.Description}</p>
                {/* Stars & Reviews */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{generateStars(tool.Rating)}</span>
                  {tool.Rating && (
                    <span className="text-gray-900 font-medium text-sm">{tool.Rating}</span>
                  )}
                  {tool.UserCount && (
                    <span className="ml-2 text-gray-400 text-xs">({tool.UserCount})</span>
                  )}
                </div>
                {/* Pros */}
                {tool.Pros && tool.Pros.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tool.Pros.map((pro) => (
                      <span key={pro} className="inline-block bg-gray-100 text-gray-700 text-xs rounded-full px-2 py-0.5">✅ {pro}</span>
                    ))}
                  </div>
                )}
                {/* Features */}
                <ul className="list-disc list-inside mb-2 text-gray-600 text-xs space-y-0.5">
                  {tool.Features && tool.Features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                {/* Price and Button Row */}
                <div className="mt-auto">
                  <div className="border-t border-gray-100 pt-2 flex flex-row justify-between items-center gap-2">
                    {tool.Pricing?.startsWith('From') ? (
                      <span className="text-sm text-gray-500 font-normal">
                        From <span className="text-indigo-700 font-bold">{tool.Pricing.replace('From ', '')}</span>
                      </span>
                    ) : (
                      <span className="text-indigo-700 font-bold text-sm">{tool.Pricing}</span>
                    )}
                    {tool.AffiliateLink && (
                      <a
                        href={tool.AffiliateLink}
                        target="_blank"
                        rel="noopener"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 shadow transition font-semibold text-sm"
                      >
                        Try Now →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
