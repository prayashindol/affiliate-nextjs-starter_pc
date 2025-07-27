'use client'

import { useState, useMemo } from 'react';

type Tool = {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  pricing: string;
  features: string[];
  affiliateLink: string;
  logo: string;
};

const softwareTools: Tool[] = [
  {
    id: 1,
    name: "Hospitable",
    category: "Guest Communication",
    description: "Automate guest messaging and task management",
    rating: 4.8,
    pricing: "From $25/month",
    features: ["Automated messaging", "Multi-platform sync", "Task management", "Review management"],
    affiliateLink: "#hospitable-affiliate",
    logo: "🏠"
  },
  {
    id: 2,
    name: "PriceLabs",
    category: "Dynamic Pricing",
    description: "AI-powered pricing optimization for maximum revenue",
    rating: 4.9,
    pricing: "From $19.99/month",
    features: ["Dynamic pricing", "Market analysis", "Seasonal adjustments", "Event-based pricing"],
    affiliateLink: "#pricelabs-affiliate",
    logo: "💰"
  },
  {
    id: 3,
    name: "Guesty",
    category: "Property Management",
    description: "All-in-one property management platform",
    rating: 4.7,
    pricing: "From $35/month",
    features: ["Multi-channel management", "Unified inbox", "Automation tools", "Revenue optimization"],
    affiliateLink: "#guesty-affiliate",
    logo: "🏢"
  },
  {
    id: 4,
    name: "Touch Stay",
    category: "Guest Experience",
    description: "Digital guidebooks for enhanced guest experience",
    rating: 4.8,
    pricing: "From £9.99/month",
    features: ["Digital guidebooks", "Offline access", "Custom branding", "Multi-language support"],
    affiliateLink: "#touchstay-affiliate",
    logo: "📱"
  },
  {
    id: 5,
    name: "Beyond Pricing",
    category: "Dynamic Pricing",
    description: "Revenue management with airline industry expertise",
    rating: 4.6,
    pricing: "1% of revenue",
    features: ["Revenue optimization", "Market data analysis", "Automated pricing", "Performance tracking"],
    affiliateLink: "#beyondpricing-affiliate",
    logo: "📊"
  },
  {
    id: 6,
    name: "Hostfully",
    category: "Property Management",
    description: "Comprehensive property management solution",
    rating: 4.5,
    pricing: "From $50/month",
    features: ["Property management", "Guest experience tools", "Direct bookings", "Automation"],
    affiliateLink: "#hostfully-affiliate",
    logo: "🎯"
  }
];

const categories = [
  { label: "All Tools", value: "all" },
  { label: "Property Management", value: "Property Management" },
  { label: "Dynamic Pricing", value: "Dynamic Pricing" },
  { label: "Guest Communication", value: "Guest Communication" },
  { label: "Guest Experience", value: "Guest Experience" }
];

const categoryColors: { [key: string]: string } = {
  "Guest Communication": "bg-indigo-400",
  "Dynamic Pricing": "bg-amber-400",
  "Property Management": "bg-pink-400",
  "Guest Experience": "bg-emerald-400",
};

function generateStars(rating: number) {
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

function CompareButton({ tool }: { tool: Tool }) {
  const [added, setAdded] = useState(false);
  return (
    <button
      className={`flex-1 border border-indigo-400 text-indigo-700 px-3 py-2 rounded-full font-semibold transition text-center text-sm
        ${added ? "bg-indigo-50 border-indigo-600" : "hover:bg-indigo-50"}`}
      type="button"
      onClick={() => {
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      aria-pressed={added}
    >
      {added ? "Added!" : "Compare"}
    </button>
  );
}

export default function ToolsDirectory() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTools = useMemo(
    () =>
      activeCategory === "all"
        ? softwareTools
        : softwareTools.filter((tool) => tool.category === activeCategory),
    [activeCategory]
  );

  return (
    <section id="tools" className="bg-gray-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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

        {/* Cards grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col p-6 hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 min-h-[460px]"
            >
              {/* Top */}
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">{tool.logo}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{tool.name}</h3>
                  <span className={`inline-flex items-center gap-1 mt-0.5 px-3 py-0.5 text-xs font-semibold border border-gray-200 text-gray-600 bg-gray-50 rounded-full`}>
                    <span className={`w-2 h-2 rounded-full mr-1 ${categoryColors[tool.category] || "bg-gray-300"}`} />
                    {tool.category}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-2">{tool.description}</p>
              {/* Stars */}
              <div className="flex items-center gap-2 mb-2 text-indigo-600 text-base font-semibold">
                <span className="text-lg">{generateStars(tool.rating)}</span>
                <span className="text-gray-900 font-medium">{tool.rating}</span>
              </div>
              {/* Features */}
              <ul className="list-disc list-inside mb-2 text-gray-600 text-sm space-y-1">
                {tool.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {/* Price + Buttons */}
            <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col gap-3">
  <div className="flex items-center gap-1 pb-1">
    {tool.pricing.startsWith('From') ? (
      <>
        <span className="text-sm text-gray-500">From</span>
        <span className="text-indigo-700 font-semibold text-base">{tool.pricing.replace('From ', '')}</span>
      </>
    ) : (
      <span className="text-indigo-700 font-semibold text-base">{tool.pricing}</span>
    )}
  </div>
                <div className="flex gap-2">
                  <CompareButton tool={tool} />
                  <a
                    href={tool.affiliateLink}
                    target="_blank"
                    rel="noopener"
                    className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-full hover:bg-indigo-700 shadow transition font-semibold text-center text-sm"
                  >
                    Get Started →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s both;
        }
      `}</style>
    </section>
  );
}
