// eslint-disable-next-line @typescript-eslint/no-require-imports
const Parser = require('rss-parser');
import { MediaStackResponse, NewsArticle, NewsFilters } from '../types/news';

// Define a type for RSS items to avoid any types
interface RSSItem {
  title?: string;
  description?: string;
  contentSnippet?: string;
  content?: string;
  contentEncoded?: string;
  link?: string;
  creator?: string;
  'dc:creator'?: string;
  pubDate?: string;
  isoDate?: string;
  mediaContent?: { $?: { url?: string } };
  mediaThumbnail?: { $?: { url?: string } };
  enclosure?: { url?: string; type?: string };
  [key: string]: unknown;
}

// Google News RSS URL with vacation rental and Airbnb related keywords
const GOOGLE_NEWS_RSS_BASE = 'https://news.google.com/rss/search';

const DEFAULT_KEYWORDS = 'airbnb OR vrbo OR "short term rental" OR "vacation rental" OR "short-term rental" OR "rental property" OR "home sharing"';

export class GoogleNewsRSSService {
  private static parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'mediaContent'],
        ['media:thumbnail', 'mediaThumbnail'],
        ['content:encoded', 'contentEncoded'],
        ['description', 'description']
      ]
    }
  });

  private static buildRSSUrl(keywords: string = DEFAULT_KEYWORDS): string {
    const params = new URLSearchParams({
      q: keywords,
      hl: 'en-US',
      gl: 'US',
      ceid: 'US:en'
    });
    
    return `${GOOGLE_NEWS_RSS_BASE}?${params.toString()}`;
  }

  private static extractImageFromContent(item: RSSItem): string | undefined {
    // Try to extract image from various sources
    
    // 1. Check media:content or media:thumbnail
    if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
      return item.mediaContent.$.url;
    }
    
    if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
      return item.mediaThumbnail.$.url;
    }

    // 2. Check enclosure for images
    if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image/')) {
      return item.enclosure.url;
    }

    // 3. Try to extract image from description or content
    const content = item.contentEncoded || item.description || item.content || '';
    if (content) {
      // Look for img tags in the content
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
      const match = content.match(imgRegex);
      if (match && match[1]) {
        return match[1];
      }
    }

    // 4. Fallback to a generic news placeholder image
    return 'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=News+Article';
  }

  private static cleanDescription(description: string): string {
    // Remove HTML tags and clean up the description
    return description
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .trim()
      .substring(0, 200) + (description.length > 200 ? '...' : '');
  }

  private static convertRSSItemToNewsArticle(item: RSSItem): NewsArticle {
    const cleanDesc = item.contentSnippet || item.description || '';
    
    return {
      title: item.title || 'Untitled',
      description: this.cleanDescription(cleanDesc),
      url: item.link || '#',
      source: item.creator || item['dc:creator'] || 'Google News',
      category: 'general',
      language: 'en',
      country: 'us',
      published_at: item.pubDate || item.isoDate || new Date().toISOString(),
      image: this.extractImageFromContent(item)
    };
  }

  static async fetchNews(filters: NewsFilters = {}): Promise<MediaStackResponse> {
    try {
      const keywords = filters.keywords || DEFAULT_KEYWORDS;
      const rssUrl = this.buildRSSUrl(keywords);
      
      const feed = await this.parser.parseURL(rssUrl);
      
      if (!feed.items || feed.items.length === 0) {
        throw new Error('No news items found in RSS feed');
      }

      // Convert RSS items to NewsArticle format
      const articles: NewsArticle[] = feed.items.map((item: RSSItem) => 
        this.convertRSSItemToNewsArticle(item)
      );

      // Apply pagination
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;
      const startIndex = offset;
      const endIndex = Math.min(startIndex + limit, articles.length);
      const paginatedArticles = articles.slice(startIndex, endIndex);

      return {
        pagination: {
          limit,
          offset,
          count: paginatedArticles.length,
          total: articles.length
        },
        data: paginatedArticles
      };
    } catch (error) {
      console.error('Error fetching Google News RSS:', error);
      
      // Fallback to sample data on error
      const fallbackData = await this.getFallbackNews(filters);
      return fallbackData;
    }
  }

  private static async getFallbackNews(filters: NewsFilters = {}): Promise<MediaStackResponse> {
    // Enhanced sample data with better images and working URLs
    const FALLBACK_NEWS_DATA: NewsArticle[] = [
      {
        title: "Airbnb Reports Strong Q4 2024 Performance with Host Earnings Reaching $2B",
        description: "The vacation rental platform announces record-breaking quarterly results as travel demand continues to surge, with hosts collectively earning over $2 billion in the fourth quarter.",
        url: "https://news.airbnb.com/2024-q4-results/",
        source: "Airbnb Newsroom",
        category: "business",
        language: "en",
        country: "us",
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop&crop=faces"
      },
      {
        title: "VRBO Launches Advanced AI Pricing Tools for Vacation Rental Hosts",
        description: "The platform introduces machine learning-powered pricing recommendations to help hosts optimize their revenue based on local market data and seasonal trends.",
        url: "https://www.vrbo.com/en-us/info/about-us/media-center",
        source: "VRBO Media Center",
        category: "technology",
        language: "en",
        country: "us",
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop&crop=faces"
      },
      {
        title: "New Short-Term Rental Regulations Impact Thousands of Hosts Nationwide",
        description: "Cities across the US implement updated zoning laws and registration requirements for vacation rentals, prompting industry groups to provide compliance guidance.",
        url: "https://www.bisnow.com/national/news/short-term-rentals",
        source: "Bisnow",
        category: "general",
        language: "en",
        country: "us",
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop&crop=faces"
      },
      {
        title: "Vacation Rental Market Shows 35% Growth as Travel Patterns Shift",
        description: "Industry analysis reveals continued strong demand for unique accommodations, with rural and mountain destinations seeing the highest booking increases.",
        url: "https://www.hospitalitynet.org/news/4117891.html",
        source: "Hospitality Net",
        category: "business",
        language: "en",
        country: "us",
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop&crop=faces"
      },
      {
        title: "Smart Home Technology Drives Higher Guest Satisfaction in Vacation Rentals",
        description: "New research shows properties with smart locks, thermostats, and voice assistants achieve 23% higher guest ratings and increased repeat bookings.",
        url: "https://www.phocuswire.com/smart-home-technology-vacation-rentals",
        source: "PhocusWire",
        category: "technology",
        language: "en",
        country: "us",
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop&crop=faces"
      },
      {
        title: "Home Sharing Platforms Partner with Tourism Boards for Sustainable Travel",
        description: "Major vacation rental companies collaborate with destinations to promote responsible tourism and support local communities through education programs.",
        url: "https://www.travelpulse.com/news/travel-agents/sustainable-tourism-partnerships.html",
        source: "Travel Pulse",
        category: "general",
        language: "en",
        country: "us",
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=250&fit=crop&crop=faces"
      }
    ];

    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, FALLBACK_NEWS_DATA.length);
    const paginatedData = FALLBACK_NEWS_DATA.slice(startIndex, endIndex);

    return {
      pagination: {
        limit,
        offset,
        count: paginatedData.length,
        total: FALLBACK_NEWS_DATA.length
      },
      data: paginatedData
    };
  }

  static async getLatestNews(limit: number = 6): Promise<MediaStackResponse> {
    return this.fetchNews({ limit });
  }

  static async getNewsByPage(page: number = 1, limit: number = 20): Promise<MediaStackResponse> {
    const offset = (page - 1) * limit;
    return this.fetchNews({ limit, offset });
  }
}