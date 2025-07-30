import { MediaStackResponse, NewsFilters, NewsArticle } from '../types/news';

const MEDIASTACK_API_KEY = 'adda2cb5f39bb523862a2ee2cedcfe96';
const BASE_URL = 'http://api.mediastack.com/v1/news';

// Keywords related to short-term rentals, Airbnb, VRBO
const DEFAULT_KEYWORDS = 'airbnb,vrbo,short term rentals,vacation rentals,short-term rentals,vacation rental,home sharing,rental properties,hospitality,rental management';

export class MediaStackService {
  private static buildQueryParams(filters: NewsFilters): string {
    const params = new URLSearchParams();
    
    params.append('access_key', MEDIASTACK_API_KEY);
    params.append('keywords', filters.keywords || DEFAULT_KEYWORDS);
    params.append('languages', filters.languages || 'en');
    params.append('limit', String(filters.limit || 50));
    params.append('offset', String(filters.offset || 0));
    params.append('sort', 'published_desc');
    
    if (filters.categories) {
      params.append('categories', filters.categories);
    }
    
    if (filters.countries) {
      params.append('countries', filters.countries);
    }
    
    return params.toString();
  }

  static async fetchNews(filters: NewsFilters = {}): Promise<MediaStackResponse> {
    try {
      const queryString = this.buildQueryParams(filters);
      const url = `${BASE_URL}?${queryString}`;
      
      console.log('Fetching news from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Cache for 5 minutes to avoid hitting API limits
        next: { revalidate: 300 }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter out articles that don't have relevant content
      if (data.data) {
        data.data = data.data.filter((article: NewsArticle) => {
          const content = `${article.title} ${article.description}`.toLowerCase();
          return content.includes('airbnb') || 
                 content.includes('vrbo') || 
                 content.includes('vacation rental') || 
                 content.includes('short-term rental') || 
                 content.includes('short term rental') ||
                 content.includes('rental property') ||
                 content.includes('home sharing');
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      // Return empty response on error to prevent app crashes
      return {
        pagination: { limit: 0, offset: 0, count: 0, total: 0 },
        data: []
      };
    }
  }

  static async getLatestNews(limit: number = 6): Promise<MediaStackResponse> {
    return this.fetchNews({ limit });
  }

  static async getNewsByPage(page: number = 1, limit: number = 20): Promise<MediaStackResponse> {
    const offset = (page - 1) * limit;
    return this.fetchNews({ limit, offset });
  }
}