// /app/tools/page.tsx

import React from "react";

async function getTools() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/tools`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tools");
  }
  return res.json();
}

export default async function ToolsPage() {
  const records = await getTools();

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">All Tools & Resources</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {records.map((rec: any) => {
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
