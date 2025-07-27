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

function generateStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  return (
    <>
      {Array.from({ length: fullStars }, (_, i) => (
        <span key={i}>★</span>
      ))}
      {hasHalfStar && <span>☆</span>}
    </>
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
    <section id="tools" className="tools-section py-16 bg-gray-50">
     <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="section-header text-center mb-10">
          <h2 className="section-title text-3xl md:text-4xl font-bold mb-2 text-gray-900">
            Essential Airbnb Management Tools
          </h2>
          <p className="section-subtitle text-gray-500">
            Discover the best software solutions to automate and optimize your hosting business
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`filter-btn px-5 py-2 rounded-full border text-sm font-medium transition-all
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
        <div className="tools-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool) => (
            <div
              className="tool-card bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 p-8 flex flex-col transition-all duration-200 animate-fadeInUp"
              key={tool.id}
              data-category={tool.category}
              style={{ minHeight: 420 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="tool-logo text-4xl">{tool.logo}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
                  <span className="tool-category text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full mt-1 inline-block">
                    {tool.category}
                  </span>
                </div>
              </div>
              <p className="tool-description text-gray-700 mb-4">{tool.description}</p>
              <div className="tool-rating flex items-center gap-2 mb-3 text-indigo-600 text-sm">
                <span className="tool-stars text-lg">{generateStars(tool.rating)}</span>
                <span className="tool-rating-value font-medium">{tool.rating}</span>
              </div>
              <div className="tool-features mb-4">
                <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                  {tool.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto flex justify-between items-end gap-2">
                <div className="tool-pricing font-semibold text-indigo-700">{tool.pricing}</div>
                <div className="tool-actions flex gap-2">
                  <button
                    className="btn btn--sm btn--outline border border-indigo-400 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-50 transition font-semibold"
                    type="button"
                  >
                    Compare
                  </button>
                  <a
                    href={tool.affiliateLink}
                    target="_blank"
                    rel="noopener"
                    className="btn btn--sm btn--affiliate bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 shadow transition font-bold"
                  >
                    Get Started →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FadeInUp animation (keeps your animation smooth) */}
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
