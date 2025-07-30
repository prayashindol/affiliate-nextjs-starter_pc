// Tool interface based on Airtable data structure
export interface Tool {
  _id?: string;
  Name?: string;
  Category?: string;
  Description?: string;
  Highlight?: string;
  Features?: string | string[];
  Pros?: string | string[];
  Rating?: number | string;
  UserCount?: string | number;
  Domain?: string;
  Website?: string;
  AffiliateLink?: string;
  Pricing?: string | number;
  Badge?: string;
  Featured?: boolean;
  DontShow?: boolean;
  Type?: string;
}

// Airtable record structure
export interface AirtableRecord {
  id: string;
  fields: Tool;
}