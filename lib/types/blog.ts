export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  featured_image?: string;
  published_at: string;
  updated_at?: string;
  status: 'published' | 'draft';
  read_time?: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  post_count: number;
}

export interface BlogResponse {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  posts: BlogPost[];
  categories: BlogCategory[];
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  page?: number;
  limit?: number;
}