// Server component that fetches tools data and passes to client component
import { Suspense } from 'react';
import ToolsDirectoryClient from './ToolsDirectoryClient';

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

async function getTools(): Promise<Tool[]> {
  try {
    const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`;
    const AIRTABLE_API_KEY = process.env.AIRTABLE_PERSONAL_TOKEN;

    if (!AIRTABLE_API_KEY) {
      console.error("Missing Airtable token");
      return [];
    }

    const res = await fetch(AIRTABLE_API_URL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      // Cache for 5 minutes to improve performance
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error("Failed to fetch Airtable data");
      return [];
    }

    const data = await res.json();
    
    // Transform data to match expected format
    return (data.records as { fields: Tool; id: string }[]).map((rec) => ({
      ...rec.fields,
      _id: rec.id
    }));
  } catch (error) {
    console.error('Error fetching tools:', error);
    return [];
  }
}

type ToolsDirectoryServerProps = {
  featuredOnly?: boolean;
};

function ToolsDirectoryLoading() {
  return (
    <section id="tools" className="bg-gray-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="h-12 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse max-w-2xl mx-auto"></div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 min-h-[440px]">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function ToolsDirectoryServer({ featuredOnly = false }: ToolsDirectoryServerProps) {
  return (
    <Suspense fallback={<ToolsDirectoryLoading />}>
      <ToolsDirectoryServerInner featuredOnly={featuredOnly} />
    </Suspense>
  );
}

async function ToolsDirectoryServerInner({ featuredOnly }: ToolsDirectoryServerProps) {
  const tools = await getTools();
  
  return <ToolsDirectoryClient initialTools={tools} featuredOnly={featuredOnly} />;
}