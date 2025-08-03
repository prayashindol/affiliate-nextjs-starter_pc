export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
  language: string;
  country: string;
  published_at: string;
  image?: string;
}

export interface NewsResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: NewsArticle[];
}

export interface NewsFilters {
  keywords?: string;
  categories?: string;
  languages?: string;
  countries?: string;
  limit?: number;
  offset?: number;
}