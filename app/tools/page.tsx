// /app/tools/page.tsx

import React from "react";
import ToolsDirectory from "../components/ToolsDirectory";

interface Tool {
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
  Type?: string;
  DontShow?: boolean;
  Featured?: boolean;
  [key: string]: unknown;
}

async function getTools() {
  try {
    // For server-side rendering, construct a full URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/tools`, {
      // Enable caching for static generation
      next: { revalidate: 300 }
    });
    if (!res.ok) {
      throw new Error("Failed to fetch tools");
    }
    return res.json();
  } catch (error) {
    console.warn('Failed to fetch tools during build, will render client-side:', error);
    return [];
  }
}

export default async function ToolsPage() {
  const records: { fields: Tool; id: string }[] = await getTools();

  if (records.length === 0) {
    // If no server-side data, use client-side component
    return (
      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">All Tools & Resources</h1>
        <ToolsDirectory />
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">All Tools & Resources</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {records.map((rec: { fields: Tool; id: string }) => {
          const tool = rec.fields;
          return (
            <div key={rec.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col">
              <h2 className="font-semibold text-lg mb-1">{tool.Name}</h2>
              <p className="mb-2 text-gray-600">{tool.Description}</p>
              <div className="text-sm mb-2">
                <strong>Type:</strong> {tool.Type} <br />
                <strong>Category:</strong> {tool.Category}
              </div>
              <a
                href={tool.Website || tool.Domain}
                target="_blank"
                rel="noopener"
                className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-full text-center font-semibold block"
              >
                Visit
              </a>
            </div>
          );
        })}
      </div>
    </main>
  );
}
