import { MediaStackResponse, NewsFilters, NewsArticle } from '../types/news';

const MEDIASTACK_API_KEY = 'adda2cb5f39bb523862a2ee2cedcfe96';
const BASE_URL = 'https://api.mediastack.com/v1/news';

// Keywords related to short-term rentals, Airbnb, VRBO
const DEFAULT_KEYWORDS = 'airbnb,vrbo,short term rentals,vacation rentals,short-term rentals,vacation rental,home sharing,rental properties,hospitality,rental management';

// Sample fallback data for development/demo purposes
const SAMPLE_NEWS_DATA: NewsArticle[] = [
  {
    title: "Airbnb Reports Record Q4 2024 Revenue Growth in Short-Term Rental Market",
    description: "The vacation rental giant sees unprecedented demand as travel rebounds, with hosts earning over $1.9 billion in the quarter. New host onboarding programs and enhanced property management tools drive platform growth.",
    url: "https://investors.airbnb.com/news/news-details/2024/default.aspx",
    source: "Airbnb Press Release",
    category: "business",
    language: "en",
    country: "us",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop"
  },
  {
    title: "VRBO Introduces AI-Powered Pricing Tools for Vacation Rental Hosts",
    description: "The platform's new dynamic pricing algorithm helps hosts optimize revenue by analyzing local market trends, seasonal demand, and competitor rates in real-time.",
    url: "https://www.vrbo.com/en-us/info/about-us/newsroom",
    source: "VRBO News",
    category: "technology",
    language: "en", 
    country: "us",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&h=400&fit=crop"
  },
  {
    title: "Short-Term Rental Regulations: New City Policies Impact Host Operations",
    description: "Major cities implement updated zoning laws and registration requirements for vacation rentals, affecting thousands of hosts nationwide. Industry experts provide compliance guidance.",
    url: "https://www.str-news.com/regulations-2024",
    source: "STR Industry Report",
    category: "general",
    language: "en",
    country: "us", 
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop"
  },
  {
    title: "Vacation Rental Market Shows Strong Recovery with 35% Year-Over-Year Growth",
    description: "Industry analysis reveals robust demand for unique accommodations, with rural and mountain destinations leading booking increases. Hosts report higher occupancy rates and average daily rates.",
    url: "https://www.vacation-rental-market.com/growth-report-2024",
    source: "Market Research Weekly",
    category: "business",
    language: "en",
    country: "us",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop"
  },
  {
    title: "Home Sharing Platforms Partner with Local Tourism Boards for Sustainable Travel",
    description: "Major vacation rental companies collaborate with destinations to promote responsible tourism and support local communities through new host education programs and visitor guidelines.",
    url: "https://sustainable-travel-news.com/home-sharing-partnerships",
    source: "Sustainable Travel News",
    category: "general",
    language: "en",
    country: "us",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
  },
  {
    title: "Rental Property Technology: Smart Home Integration Boosts Guest Satisfaction", 
    description: "New study shows vacation rentals with smart locks, thermostats, and voice assistants achieve 23% higher guest ratings and increased booking rates among tech-savvy travelers.",
    url: "https://proptech-insights.com/smart-home-vacation-rentals",
    source: "PropTech Insights",
    category: "technology",
    language: "en",
    country: "us",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(), // 2.5 days ago
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop"
  },
  {
    title: "Hospitality Industry Trends: Short-Term Rentals Reshape Travel Accommodation Preferences",
    description: "Consumer behavior research indicates 68% of travelers now prefer vacation rentals for family trips, driving hotels to adapt strategies and explore hybrid accommodation models.",
    url: "https://hospitality-trends.com/str-impact-2024",
    source: "Hospitality Trends Quarterly",
    category: "business",
    language: "en",
    country: "us",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=400&fit=crop"
  },
  {
    title: "Rental Management Software: New Platform Features Streamline Host Operations",
    description: "Leading property management companies release updated software with automated messaging, dynamic pricing, and integrated cleaning coordination to help hosts scale their operations efficiently.",
    url: "https://rental-management-today.com/software-updates-2024",
    source: "Rental Management Today",
    category: "technology", 
    language: "en",
    country: "us",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 84).toISOString(), // 3.5 days ago
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop"
  }
];

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
      console.log('Using fallback sample data for development');
      
      // Return sample data with pagination info when API fails
      const limit = filters.limit || 50;
      const offset = filters.offset || 0;
      const startIndex = offset;
      const endIndex = Math.min(startIndex + limit, SAMPLE_NEWS_DATA.length);
      const paginatedData = SAMPLE_NEWS_DATA.slice(startIndex, endIndex);
      
      return {
        pagination: { 
          limit, 
          offset, 
          count: paginatedData.length, 
          total: SAMPLE_NEWS_DATA.length 
        },
        data: paginatedData
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